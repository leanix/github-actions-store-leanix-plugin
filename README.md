# LeanIX Microservice Intelligence action

This action sends information about your project to the LeanIX API and triggers the update of your related factsheet. The specifications towards the factsheet are given in the manifest.yml file in your repository.

## Inputs

### `host`

**Required** The LeanIX host where the connector is located, e.g.: eu.leanix.net

### `api-token`

**Required** The LeanIX API token for secure access.

### `manifest-path`

**Required** The path to the LeanIX manifest in your repository. Default: /manifest.yml

### `stage`

The stage the workflow is triggered for. Default: production

### `version`

The current version the workflow is triggered for.

## Outputs

## Example usage

uses: TODO
with:
host: ${{ env.HOST }}
api-token: ${{ secrets.LEANIX_API_TOKEN }}
manifest-path: ${{ env.LEANIX_MANIFEST_PATH }}
stage: ${{ env.STAGE }}
version: ${{ env.VERSION }}
