#!/bin/bash
# Environment variables are from action.yaml

set -e

if [[ $1 == "MAVEN" ]]; then
  #  if maven user settings path is not null or empty
  pwd
  ls
  if [[ $2 != "" ]]; then
    echo "Maven repository detected with custom user settings (using path $2). Attempting to generate dependency file"
    mvn -s "$2" license:download-licenses
  else
    echo "Maven repository detected. Attempting to generate dependency file"
    mvn license:download-licenses
  fi
fi

if [[ $1 == "NPM" ]]; then
  echo "Node repository detected. Attempting to generate dependency file"
  npm i -g license-checker
  npm i
  license-checker --json >licenses.json
fi

if [[ $1 == "GRADLE" ]]; then
  echo "Gradle repository detected. Attempting to generate dependency file"
  gradle generateLicenseReport -I /vsmCiCd-init.gradle
fi

#node /dist/index.js
