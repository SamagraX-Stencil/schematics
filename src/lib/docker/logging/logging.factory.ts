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

export function main(options: LoggingOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return branchAndMerge(
      chain([
        generateBasicFiles(options, context),
      ]),
    )(tree, context);
  };
}

function generateBasicFiles(
  options: LoggingOptions,
  context: SchematicContext,
): Rule {
  return (tree: Tree) => {
    const path = './docker/logging';
    const sourceTemplate = apply(
      url(join('../files' as Path, options.language, 'logging' as Path)),
      [move(path)],
    );
    return chain([mergeWith(sourceTemplate)])(tree, context);
  };
}

