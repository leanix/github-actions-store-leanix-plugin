#!/bin/bash

set -e

if [[ $1 == "MAVEN" ]]; then
  echo "Maven repository detected. Attempting to generate dependency file"
  mvn license:download-licenses
fi

if [[ $1 == "NPM" ]]; then
  echo "Node repository detected. Attempting to generate dependency file"
  npm i -g license-checker
  npm i
  license-checker --json >licenses.json
fi

if [[ $1 == "GRADLE" ]]; then
  echo "Gradle repository detected. Attempting to generate dependency file"
  gradle generateLicenseReport -I /miCiCd-init.gradle
fi

node /dist/index.js
