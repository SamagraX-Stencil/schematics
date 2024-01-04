import { Path, join } from '@angular-devkit/core';
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
} from '@angular-devkit/schematics';

import { LoggingOptions } from './logging.schema';
import { elasticsearch } from './Dockerfile content/elasticsearch';
import { kibana } from './Dockerfile content/kibana';
import { logstash } from './Dockerfile content/logstash';
import { setup } from './Dockerfile content/setup';
import { content } from './env-content';

export function main(options: LoggingOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return branchAndMerge(
      chain([
        generateBasicFiles(options, context),
        generateElasticSearch,
        generateKibana,
        generateLogstash,
        generateSetup,
        createEnvFile(),
      ]),
    )(tree, context);
  };
}

function generateBasicFiles(
  options: LoggingOptions,
  context: SchematicContext,
): Rule {
  return (tree: Tree) => {
    const path = './services/logging';
    const sourceTemplate = apply(
      url(join('./files' as Path, options.language)),
      [move(path)],
    );
    return chain([mergeWith(sourceTemplate)])(tree, context);
  };
}

function generateElasticSearch(): Rule {
  return (tree: Tree) => {
    const path = `./services/logging/elasticsearch`;

    const elasticPath = join(path as Path, 'Dockerfile');
    tree.create(elasticPath, elasticsearch);
    return tree;
  };
}

function generateKibana(): Rule {
  return (tree: Tree) => {
    const path = `./services/logging/kibana`;

    const kibanaPath = join(path as Path, 'Dockerfile');
    tree.create(kibanaPath, kibana);
    return tree;
  };
}

function generateLogstash(): Rule {
  return (tree: Tree) => {
    const path = `./services/logging/logstash`;

    const logstashPath = join(path as Path, 'Dockerfile');
    tree.create(logstashPath, logstash);
    return tree;
  };
}

function generateSetup(): Rule {
  return (tree: Tree) => {
    const path = `./services/logging/setup`;

    const setupPath = join(path as Path, 'Dockerfile');
    tree.create(setupPath, setup);
    return tree;
  };
}

function createEnvFile(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const envFilePath = `./services/logging/.env`;

    tree.create(envFilePath, content);

    return tree;
  };
}
