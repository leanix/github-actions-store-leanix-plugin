FROM node:12
RUN apt-get update && apt-get install -y openjdk-8-jdk && apt-get install maven -y && apt-get install gradle -y

COPY entrypoint.sh /entrypoint.sh
COPY miCiCd-init.gradle /miCiCd-init.gradle
COPY dist/index.js dist/index.js

ENTRYPOINT ["/entrypoint.sh"]
