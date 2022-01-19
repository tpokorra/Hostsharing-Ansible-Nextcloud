#!/usr/local/bin/hsscript -f

hsdomain(arguments);

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

function hsdomain(args) {
  reader = new java.io.BufferedReader(new java.io.FileReader(args[0]));
  params = reader.readLine();
  reader.close();
  domainname = getParam("name", params);
  if (domainname == null) {
    print('{"failed":true,"msg":"parameter name required"}');
    return;
  }
  useraccount = getParam("owner", params);
  if (useraccount == null) {
    print('{"failed":true,"msg":"parameter owner required"}');
    return;
  }
  shouldExist = getParam("exists", params);
  if (shouldExist == null) {
    print('{"failed":true,"msg":"parameter exists with value true or false required"}');
    return;
  }
  existingDomains = domain.search({where:{name:domainname}});
  if ("false".localeCompare(shouldExist)) {
    if (existingDomains.length < 1) {
      try {
        domain.add({set:{name:domainname,user:useraccount}});
        print('{"changed":true,"msg":"added"}');
      }
      catch (e) {
        print('{"failed":true,"msg":"' + String(e) + '"}');
      }
    } else {
      if (existingDomains[0].user.localeCompare(useraccount)) {
        print('{"failed":true,"msg":"domain owner change is not supported"}');
      } else {
        print('{"changed":false,"msg":"exists"}');
      }
    }
  } else {
    if (existingDomains.length > 0) {
      try {
        domain.remove({where:{name:domainname}});
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
