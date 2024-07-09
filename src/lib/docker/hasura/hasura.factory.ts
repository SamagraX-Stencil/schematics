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

const hasuraConfig = `
  hasura:
    image: hasura/graphql-engine:v2.0.0
    ports:
      - "8080:8080"
    environment:
      HASURA_GRAPHQL_DATABASE_URL: \${HASURA_GRAPHQL_DATABASE_URL}
      HASURA_GRAPHQL_ENABLE_CONSOLE: "true"
      HASURA_GRAPHQL_ADMIN_SECRET: \${HASURA_GRAPHQL_ADMIN_SECRET}
    depends_on:
      - postgres
`;

const hasuraEnvContent = `
HASURA_GRAPHQL_DATABASE_URL=your_postgres_database_url
HASURA_GRAPHQL_ADMIN_SECRET=your_hasura_admin_secret
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

    addService(tree, context, 'hasura',hasuraConfig,composeFilePath );

    addEnvFile(tree, context,'Hasura', envFilePath, hasuraEnvContent);

    updateStartScript(tree, context, 'hasura', options.path as Path);

    return tree;
  };
}
