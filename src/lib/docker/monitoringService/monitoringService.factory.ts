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

import { monitoringServiceOptions } from './monitoringService.schema';

export function main(options: monitoringServiceOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return branchAndMerge(
      chain([
        generateBasicFiles(options, context),
      ]),
    )(tree, context);
  };
}

function generateBasicFiles(
  options: monitoringServiceOptions,
  context: SchematicContext,
): Rule {
  return (tree: Tree) => {
    const path = './docker/monitoringService';
    const sourceTemplate = apply(
      url(join('../files' as Path, options.language, 'monitoringService' as Path)),
      [move(path)],
    );
    return chain([mergeWith(sourceTemplate)])(tree, context);
  };
}

