FROM node:16.15.0-bullseye-slim
RUN apt-get update && apt-get install -y openjdk-8-jdk && apt-get install maven -y && apt-get install gradle -y

COPY entrypoint.sh /entrypoint.sh
COPY vsmCiCd-init.gradle /vsmCiCd-init.gradle
COPY dist/index.js /dist/index.js

ENTRYPOINT ["/entrypoint.sh"]
