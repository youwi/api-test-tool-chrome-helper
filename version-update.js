/**
 * 自动添加最后一个版本号
 * @return {string}
 */
const fs=require("fs");

function versionUpdate(version) {

  let versionList = version.split(".");
  versionList[2]++;
  return versionList.join(".");
}


function updateManifestVersion(){
  let manifest = require("./manifest.json");
  manifest.version=versionUpdate(manifest.version);
  manifest.version_name=manifest.version;
  let out=JSON.stringify(manifest,0,4 );
  fs.writeFileSync('./manifest.json',out);
}
updateManifestVersion()