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
import { HasuraOptions } from './hasura.schema';
import { addService } from '../utils/addService-utils';
import { addEnvFile } from '../utils/addEnv-utils';

const hasuraServiceConfig = `
    image: hasura/graphql-engine:latest
    ports:
      - '8080:8080'
    depends_on:
      - 'postgres'
    restart: always
    environment:
      HASURA_GRAPHQL_DATABASE_URL: \${HASURA_GRAPHQL_DATABASE_URL}
      HASURA_GRAPHQL_ENABLE_CONSOLE: \${HASURA_GRAPHQL_ENABLE_CONSOLE}
      HASURA_GRAPHQL_ADMIN_SECRET: \${HASURA_GRAPHQL_ADMIN_SECRET}
    volumes:
    - hasura_metadata:/hasura_metadata
`;
const hasuraVolumeConfig = "hasura_metadata";

const hasuraEnvContent = `
HASURA_GRAPHQL_DATABASE_URL=postgres://postgres:postgres@postgres:5432/postgres_db
HASURA_GRAPHQL_ENABLE_CONSOLE=true
HASURA_GRAPHQL_ADMIN_SECRET=myadminsecretkey
`;

export function main(options: HasuraOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return branchAndMerge(
      chain([
        generateBasicFiles(options, context),
      ]),
    )(tree, context);
  };
}

function generateBasicFiles(
  options: HasuraOptions,
  context: SchematicContext,
): Rule {
  return (tree: Tree) => {
    return chain([
      addHasuraService(options),
    ])(tree, context);
  };
}

function addHasuraService(options: HasuraOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    options.path = options.path === "undefined" ? "" : options.path;
    
    const composeFilePath = join(options.path as Path,normalize('docker-compose.yml'));
    const envFilePath = join(options.path as Path,normalize('.env'));

    addService(tree, context, 'services', 'hasura', hasuraServiceConfig, composeFilePath);
    addService(tree, context, 'volumes', hasuraVolumeConfig, {}, composeFilePath);

    addEnvFile(tree, context,'Hasura', envFilePath, hasuraEnvContent);

    updateStartScript(tree, context, 'hasura', options.path as Path);

    return tree;
  };
}
