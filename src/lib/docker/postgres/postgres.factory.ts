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

import { PostgresOptions } from './postgres.schema';

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
    const path = normalize('docker/postgres');
    const srcPath: Source = url(join(normalize('../files' as Path), options.language, 'postgres'));
    const sourceTemplate = apply(
      srcPath,
      [move(path)],
    );
    return chain([
      mergeWith(sourceTemplate),
      addPostgresService(),
    ])(tree, context);
  };
}

function addPostgresService(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const composeFilePath = normalize('docker-compose.yml');
    const envFilePath = normalize('.env');

    // Create or update the docker-compose.yml
    if (tree.exists(composeFilePath)) {
      const composeFile = tree.read(composeFilePath)?.toString('utf-8');
      if (!composeFile?.includes('services:') || !composeFile.includes('postgres:')) {
        let updatedComposeFile = composeFile || '';
        if (!composeFile?.includes('services:')) {
          updatedComposeFile += `services:\n`;
        }

        updatedComposeFile += `${postgresConfig}`;
        tree.overwrite(composeFilePath, updatedComposeFile);
        context.logger.info('Postgres service added to docker-compose.yml');
      } else {
        context.logger.info('Postgres service already exists in docker-compose.yml');
      }
    } else {
      const newComposeFile = `services:\n${postgresConfig}`;
      tree.create(composeFilePath, newComposeFile);
      context.logger.info('docker-compose.yml created with Postgres service');
    }

    if (tree.exists(envFilePath)) {
      let currentEnvContent = tree.read(envFilePath)?.toString('utf-8').trim() || '';
      const newEnvVars = postgresEnvContent.trim().split('\n').filter(line => {
        const [key] = line.split('=');
        return !currentEnvContent.includes(`${key}=`);
      }).join('\n');

      if (newEnvVars) {
        currentEnvContent += `\n${newEnvVars}`;
        tree.overwrite(envFilePath, currentEnvContent.trim());
        context.logger.info('Postgres environment variables added to .env file');
      } else {
        context.logger.info('Postgres environment variables already exist in .env file');
      }
    } else {
      tree.create(envFilePath, postgresEnvContent.trim());
      context.logger.info('.env file created with PostgreSQL environment variables');
    }

    return tree;
  };
}
