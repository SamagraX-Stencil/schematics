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

import { PullOptions } from './pullservice.schema';

export function main(options: PullOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return branchAndMerge(
      chain([
        generateBasicFiles(options, context),
      ]),
    )(tree, context);
  };
}

function generateBasicFiles(
  options: PullOptions,
  context: SchematicContext,
): Rule {
  return (tree: Tree) => {
    const path = './frontend';
    const sourceTemplate = apply(
      url(join('../files' as Path, options.language, 'frontend' as Path)),
      [move(path)],
    );
    return chain([mergeWith(sourceTemplate)])(tree, context);
  };
}

