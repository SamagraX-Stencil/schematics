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

import { HasuraOptions } from './hasura.schema';

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
    const path = normalize('docker/hasura');
    const srcPath: Source = url(join(normalize('../files' as Path), options.language, 'hasura'));
    const sourceTemplate = apply(
      srcPath,
      [move(path)],
    );
    return chain([
      mergeWith(sourceTemplate),
      addHasuraService(),
    ])(tree, context);
  };
}

function addHasuraService(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const composeFilePath = normalize('docker-compose.yml');
    const envFilePath = normalize('.env');

    if (tree.exists(composeFilePath)) {
      const composeFile = tree.read(composeFilePath)?.toString('utf-8');
      if (!composeFile?.includes('services:') || !composeFile.includes('hasura:')) {
        let updatedComposeFile = composeFile || '';
        if (!composeFile?.includes('services:')) {
          updatedComposeFile += `services:\n`;
        }

        updatedComposeFile += `${hasuraConfig}`;
        tree.overwrite(composeFilePath, updatedComposeFile);
        context.logger.info('Hasura service added to docker-compose.yml');
      } else {
        context.logger.info('Hasura service already exists in docker-compose.yml');
      }
    } else {
      const newComposeFile = `services:\n${hasuraConfig}`;
      tree.create(composeFilePath, newComposeFile);
      context.logger.info('docker-compose.yml created with Hasura service');
    }

    if (tree.exists(envFilePath)) {
      let currentEnvContent = tree.read(envFilePath)?.toString('utf-8').trim() || '';
      const newEnvVars = hasuraEnvContent.trim().split('\n').filter(line => {
        const [key] = line.split('=');
        return !currentEnvContent.includes(`${key}=`);
      }).join('\n');

      if (newEnvVars) {
        currentEnvContent += `\n${newEnvVars}`;
        tree.overwrite(envFilePath, currentEnvContent.trim());
        context.logger.info('Hasura environment variables added to .env file');
      } else {
        context.logger.info('Hasura environment variables already exist in .env file');
      }
    } else {
      tree.create(envFilePath, hasuraEnvContent.trim());
      context.logger.info('.env file created with Hasura environment variables');
    }

    return tree;
  };
}
