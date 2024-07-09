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
    image: postgres:13
    restart: always
    environment:
      POSTGRES_USER: \${POSTGRES_USER}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
      POSTGRES_DB: \${POSTGRES_DB}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
`;

const postgresEnvContent = `
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DB=your_postgres_db
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
