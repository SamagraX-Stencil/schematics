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
import { PostgresOptions } from './postgres.schema';
import { addEnvFile } from '../utils/addEnv-utils';
import { addService } from '../utils/addService-utils';
const postgresConfig = `
  postgres:
    image: postgres:latest
    environment:
      POSTGRES_USER: \${POSTGRES_USER}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
      POSTGRES_DB: \${POSTGRES_DB}
    restart: always
    healthcheck:
      test: [ "CMD-SHELL", "pg_isready -U postgres" ]
      interval: 5s
      timeout: 5s
      retries: 5
`;

const postgresEnvContent = `
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres_db
`;

export function main(options: PostgresOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return branchAndMerge(
      chain([
        generateBasicFiles(options, context),
      ]),
    )(tree, context);
  };
}

function generateBasicFiles(
  options: PostgresOptions,
  context: SchematicContext,
): Rule {
  return (tree: Tree) => {
    return chain([
      addPostgresService(options),
    ])(tree, context);
  };
}

function addPostgresService(options: PostgresOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    options.path = options.path === "undefined" ? "" : options.path;
    
    const composeFilePath = join(options.path as Path,normalize('docker-compose.yml'));
    const envFilePath = join(options.path as Path,normalize('.env'));

    addService(tree, context, 'postgres',postgresConfig,composeFilePath );

    addEnvFile(tree, context,'Postgres', envFilePath, postgresEnvContent);

    updateStartScript(tree, context, 'postgres', options.path as Path);

    return tree;
  };
}
