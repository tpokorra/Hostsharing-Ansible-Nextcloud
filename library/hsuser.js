#!/usr/local/bin/hsscript -f

hsuser(arguments);

function getParam(paramName, paramsString) {
  re = new RegExp(paramName + "\=\'([^\']*)\'");
  matches = re.exec(paramsString);
  if (matches != null) {
    return matches[1];
  } else {
    re = new RegExp(paramName + "\=([^ ]*)");
    matches = re.exec(paramsString);
    if (matches != null) {
      return matches[1];
    } else {
      return null;
    }
  }
}

function hsuser(args) {
  reader = new java.io.BufferedReader(new java.io.FileReader(args[0]));
  params = reader.readLine();
  reader.close();
  username = getParam("name", params);
  if (username == null) {
    print('{"failed":true,"msg":"parameter name required"}');
    return;
  }
  passwd = getParam("password", params);
  if (passwd == null) {
    print('{"failed":true,"msg":"parameter password required"}');
    return;
  }
  shouldExist = getParam("exists", params);
  if (shouldExist == null) {
    print('{"failed":true,"msg":"parameter exists with value true or false required"}');
    return;
  }
  shell="/usr/bin/passwd";
  existingUsers = user.search({where:{name:username}});
  if ("false".localeCompare(shouldExist)) {
    if (existingUsers.length < 1) {
      try {
        user.add({set:{name:username,shell:shell,password:passwd}});
        print('{"changed":true,"msg":"added"}');
      }
      catch (e) {
        print('{"failed":true,"msg":"' + String(e) + '"}');
      }
    } else {
      try {
        user.update({where:{name:username},set:{password:passwd,shell:shell}});
        print('{"changed":false,"msg":"updated"}');
      }
      catch (e) {
        print('{"failed":true,"msg":"' + String(e) + '"}');
      }
    }
  } else {
    if (existingUsers.length > 0) {
      try {
        user.remove({where:{name:username}});
        print('{"changed":true,"msg":"removed"}');
      }
      catch (e) {
        print('{"failed":true,"msg":"' + String(e) + '"}');
      }
    } else {
      print('{"changed":false,"msg":"absent"}');
    }
  }
}
