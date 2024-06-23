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

import { TemporalOptions } from './temporal.schema';

export function main(options: TemporalOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return branchAndMerge(
      chain([
        generateBasicFiles(options, context),
      ]),
    )(tree, context);
  };
}

function generateBasicFiles(
  options: TemporalOptions,
  context: SchematicContext,
): Rule {
  return (tree: Tree) => {
    const path = './docker/temporal';
    const sourceTemplate = apply(
      url(join('../files' as Path, options.language, 'temporal' as Path)),
      [move(path)],
    );
    return chain([mergeWith(sourceTemplate)])(tree, context);
  };
}

