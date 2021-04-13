

# LeanIX Microservice Intelligence action

## Description

If this action is used in your github workflow, it sends information about your github project to the LeanIX API and triggers an update of the LeanIX factsheet related to the project and the environment of your build. Specifications relating to the factsheet are set via the manifest.yml file in your repository and via input parameters of the action, which are explained in more detail below.
On actions, workflows and using actions in workflows see also: https://docs.github.com/en/actions/learn-github-actions

## Usage

### Prerequisites:

#### manifest.yml file

Place the manifest.yml file containing the correct information about your project in your project repository. You can use any path you want, this is passed to the action as an input parameter.

#### Secret LeanIX API token

In the "Settings" -> "Secrets" -> "Actions secrets" area of ​​the github project for which the action is used, a secret must be created, the value of which is a valid LeanIX token for the host that is used in the action. For the use of secrets in github see also https://docs.github.com/en/actions/reference/encrypted-secrets.


#### Adding a workflow to your github repository

If you are logged into github and are on the page of your repository, you will see a bar with tabs below the repository name, one of which is titled "Actions".

![Actions tab](images/actions-tab.png)

Under this tab you will find the workflows that are specified in your project. A workflow could be described as the collection of jobs, steps in jobs and actions (like the LeanIX Action) in steps.

If you want to add the LeanIX action to a workflow, you can use the example workflow code listed below. Just add a file with a valid workflow yml-file to your repository unter the path **.github/workflows/** , for example a file containing the workflow below under **.github/workflows/test_leanix_action.yml** .

More information on creating workflows for a project and adding actions to workflows can be found at [https://docs.github.com/en/actions/learn-github-actions/introduction-to-github-actions#create-an-example-workflow](https://docs.github.com/en/actions/learn-github-actions/introduction-to-github-actions#create-an-example-workflow "https://docs.github.com/en/actions/learn-github-actions/introduction-to-github-actions#create-an-example-workflow")


#### Monitoring of the action

  
The monitoring of the workflows and thus also that of the actions belonging to your project also takes place under the tab "actions". There you can see the output of every step of your workflow. As part of a step, the LeanIX action will generate meaningful messages both in the event of successful execution and in the event of an error, which you can use to understand what happened during the execution of the action.


### Example workflow

The input parameters used in the example are explained in more detail in the "Inputs" section. The workflow, including the action, is triggered when you push a new commit to the repository.

    name: leanix-action-test
    
    on:  
      push:  
    
    env:  
      HOST: app.leanix.net  
      LEANIX_MANIFEST_PATH: /lx-manifest.yml  
      DEPENDENCY_MANAGER: NPM  
      STAGE: test  
      VERSION: 2.2.0
	  ALLOW_FAILURE: true
	  
    
    jobs:  
      leanix_test_job:  
        runs-on: ubuntu-latest  
        steps:  
          - name: Checkout  
            uses: actions/checkout@v2  
          - name: LeanIX Microservice Intelligence  
            uses: leanix/github-actions-store-leanix-plugin@1.2.0  
            id: LIXMI
            with:  
              host: ${{ env.HOST }}  
              api-token: ${{ secrets.LEANIX_API_TOKEN }}  
              manifest-path: ${{ env.LEANIX_MANIFEST_PATH }}  
              dependency-manager: ${{ env.DEPENDENCY_MANAGER }}  
              stage: ${{ env.STAGE }}  
              version: ${{ env.VERSION }}
			  allow-failure: ${{ env.ALLOW_FAILURE }}


#### Environment variables
In the example workflow, various environment variables are initialized in the "env:" area. This allows you to reuse the values ​​in the jobs of your workflow. Of course, every value in the **"with:"** area of ​​the github action can also be set directly. In the example, the values ​​of the environment variables are assigned to the input parameters of the LeanIX Action in this area. In order to meet the security standards, the API token must not be set in clear text in the workflow area, but the way described above must be chosen.

#### Mandatory and optional definitions
The steps and assignments carried out under "jobs:" are necessary for the use of the LeanIX Action. In addition to the environment variables / input parameters to be set correctly, you can choose the following values ​​yourself:

- **"uses: leanix/github-actions-store-leanix-plugin@1.2.0":** Here you can choose which version of the LeanIX action you want to use.
- **"id: LIXMI":** This value is optional, here you can choose any ID for the LeanIX step in order to reference it elsewhere. For more information, see also https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstepsid


### Inputs

#### `host`


**Required** 

The LeanIX host where the connector is located that should be used by the action, e.g.: eu.leanix.net

#### `api-token`

**Required**

 The LeanIX API token for secure access to the LeanIX connector API on the chosen host. Use the name you chose for the secret in the project settings here.

#### `manifest-path`

**Required** 

The path to the LeanIX manifest in your repository. Default: /lx-manifest.yml

#### `dependency-manager`

**Required**

Type of the dependency manager used for the project. Supported possible values: NPM, MAVEN, GRADLE.

#### `stage`

The stage the workflow is triggered for. Default: production

#### `version`

The current version the workflow is triggered for.

#### `allow-failure`

Flag that indicates whether the entire workflow is allowed to continue if an error occurs in the LeanIX action. "True" means, the workflow continues upon error in the action, "false" makes it exit with error. Default: true

