import { Path, join, normalize } from '@angular-devkit/core';
import {
  apply,
  url,
  branchAndMerge,
  chain,
  Rule,
  SchematicContext,
  Tree,
  move,
  mergeWith,
  Source,
} from '@angular-devkit/schematics';
import { updateStartScript } from '../utils/start-utils';
import { FusionAuthOptions } from './fusionauth.schema';
import { addService } from '../utils/addService-utils';
import { addEnvFile } from '../utils/addEnv-utils';

const fusionauthConfig = `
  fusionauth:
    image: fusionauth/fusionauth-app:latest
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      DATABASE_URL: jdbc:postgresql://postgres:5432/fusionauth
      DATABASE_ROOT_USERNAME: \${POSTGRES_USER}
      DATABASE_ROOT_PASSWORD: \${POSTGRES_PASSWORD}
      DATABASE_USERNAME: \${DATABASE_USERNAME}
      DATABASE_PASSWORD: \${DATABASE_PASSWORD}
      FUSIONAUTH_APP_MEMORY: \${FUSIONAUTH_APP_MEMORY}
      FUSIONAUTH_APP_RUNTIME_MODE: \${FUSIONAUTH_APP_RUNTIME_MODE}
      FUSIONAUTH_APP_URL: http://fusionauth:9011
    healthcheck:
      test: curl --silent --fail http://localhost:9011/api/status -o /dev/null -w "%{http_code}"
      interval: 5s
      timeout: 5s
      retries: 5
    restart: unless-stopped
    ports:
      - 9011:9011
    volumes:
      - fusionauth_config:/usr/local/fusionauth/config


volumes:
  db_data:
  fusionauth_config:
`;

const fusionauthEnvContent = `
DATABASE_USERNAME=fusionauth
DATABASE_PASSWORD=secret
FUSIONAUTH_APP_MEMORY=512M
FUSIONAUTH_APP_RUNTIME_MODE=development
`;

export function main(options: FusionAuthOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return branchAndMerge(
      chain([
        generateBasicFiles(options, context),
      ]),
    )(tree, context);
  };
}

function generateBasicFiles(
  options: FusionAuthOptions,
  context: SchematicContext,
): Rule {
  return (tree: Tree) => {
    return chain([
      addFusionAuthService(options),
    ])(tree, context);
  };
}

function addFusionAuthService(options: FusionAuthOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    options.path = options.path === "undefined" ? "" : options.path;
    
    const composeFilePath = join(options.path as Path,normalize('docker-compose.yml'));
    const envFilePath = join(options.path as Path,normalize('.env'));

    addService(tree, context, 'fusionauth',fusionauthConfig,composeFilePath );

    addEnvFile(tree, context,'Fusionauth', envFilePath, fusionauthEnvContent);

    updateStartScript(tree, context, 'fusionauth', options.path as Path);

    return tree;
  };
}
