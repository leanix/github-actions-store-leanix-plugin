FROM node:current-alpine3.17
RUN apt-get update && apt-get install -y openjdk-11-jdk && apt-get install maven -y && apt-get install gradle -y

COPY entrypoint.sh /entrypoint.sh
COPY vsmCiCd-init.gradle /vsmCiCd-init.gradle
COPY dist/index.js /dist/index.js

ENTRYPOINT ["/entrypoint.sh"]
