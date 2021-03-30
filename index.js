const core = require("@actions/core");
const base64 = require("base-64");
const fetch = require("node-fetch");
const FormData = require("form-data");
const fs = require("fs");
const yaml = require("js-yaml");
// const testFolder = "./";

function createConnectorCallInit(host, jwtToken) {
  return {
    host: host,
    path: "/services/cicd-connector/v2/deployment",
    method: "POST",
    protocol: "https:",
    headers: {
      Authorization: `Bearer ` + jwtToken,
    },
  };
}

async function sendInfoToAPI(host, jwtToken, {manifestJSON, stage, version, dependenciesFile, dependencyManager}) {
  const options = createConnectorCallInit(host, jwtToken);
  const formData = new FormData();
  // stage should not be null
  stage = stage ? stage : "";
  formData.append("manifest", manifestJSON);
  formData.append("dependencies", dependenciesFile);
  formData.append("data", JSON.stringify({ version, stage, dependencyManager }), {
    contentType: "application/json",
  });

  return new Promise((resolve, reject) => {
    const req = formData.submit(options, (err, res) => {
      if (err) {
        "Http-response to connector API was not ok - http status response: " +
          res.statusCode +
          " " +
          err.message;
        return reject(new Error(err.message));
      }
      if (res.statusCode < 200 || res.statusCode > 299) {
        return reject(new Error(`HTTP status code ${res.statusCode}`));
      }
      const body = [];
      res.on("data", (chunk) => body.push(chunk));
      res.on("end", () => {
        const resString = Buffer.concat(body).toString();
        resolve(resString);
      });
    });
  })
    .then((result) => {
      return result;
    })
    .catch((reason) => {
      console.error("Couldn't access the API");
      throw new Error(reason);
    });
}

async function loadManifestJSON(manifestPath) {
  return new Promise(function (resolve, reject) {
    fs.readFile("." + manifestPath, "utf8", function (error, manifest) {
      if (error) reject(error);
      else {
        resolve(manifest);
      }
    });
  })
    .then((manifest) => {
      if (!manifest) {
        throw new Error(
          "Something is wrong with the manifest file. Please verify your file and filepath!"
        );
      }
      return JSON.stringify(yaml.load(manifest));
    })
    .catch((reason) => {
      console.error("Couldn't find or read the manifest file!");
      throw new Error(reason);
    });
}

function createAPIAccessTokenRequestInit(secret) {
  const headers = new fetch.Headers();
  headers.append(
    "Authorization",
    "Basic " + base64.encode("apitoken:" + secret)
  );
  headers.append("Content-Type", "application/x-www-form-urlencoded");
  return {
    method: "post",
    auth: {
      user: "apitoken",
      password: secret,
    },
    body: "grant_type=client_credentials",
    headers: headers,
    json: true,
  };
}

function getJWTToken(secret, host) {
  return fetch(
    "https://" + host + "/services/mtm/v1/oauth2/token",
    createAPIAccessTokenRequestInit(secret)
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          "Http-response was not ok - http status response: " +
            response.status +
            " " +
            response.statusText
        );
      }
      return response.json();
    })
    .then((json) => {
      return json.access_token;
    })
    .catch((reason) => {
      console.error("Couldn't get API-Token!");
      throw new Error(reason);
    });
}

function getDependenciesFile(dependencyManager) {
  console.log("Getting generated dependency file");
  const conf = {
    "MAVEN": './target/generated-resources/licenses.xml',
    "GRADLE": './build/reports/licenses.json', // make sure init.gradle file is generating with exact name
    "NPM": './licenses.json'
  }

  if(!fs.existsSync(conf[dependencyManager])) {
    core.warning("Could not find dependency file");
    return null;
  }

  return fs.createReadStream(conf[dependencyManager]);
}

function getCoreInputOrError(name) {
  let input = core.getInput(name);
  if(!input) {
    throw new Error(`Input (${name}) cannot be empty`);
  }
  return input;
}

async function main() {
  try {
    // the host-address of the connector API
    const host = core.getInput("host");
    // the API-token of the customer
    const secret = core.getInput("api-token");
    // the path where the manifest is found in the repository
    const manifestPath = core.getInput("manifest-path");
    // The stage that is deployed to
    const stage = core.getInput("stage");
    // the version of the deployed product
    const version = getCoreInputOrError("version");
    const dependencyManager = core.getInput("dependency-manager");

    const jwtToken = await getJWTToken(secret, host);

    const manifestJSON = await loadManifestJSON(manifestPath);

    const dependenciesFile = getDependenciesFile(dependencyManager);

    const apiResult = await sendInfoToAPI(
      host,
      jwtToken,
      {manifestJSON, stage, version, dependenciesFile, dependencyManager}
    );
    console.log("API-result: " + apiResult);

    // use for finding pom.xml, package.json etc.
    /*     fs.readdirSync(testFolder).forEach((file) => {
      console.log(file);
    }); */
  } catch (error) {
    // concerning this error handling here: We don't want the action to fail at any time and kill the workflow.
    // Just log the error and don't affect the success.

    console.log(error.message);

    // TODO: comment in when in production to never fail
    process.exit(0);

    // TODO: for testing and seeing the failing, remove when going into production!
    // core.setFailed(error.message);
  }
}

main();
