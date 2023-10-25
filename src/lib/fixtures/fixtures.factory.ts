import { join, Path } from '@angular-devkit/core';
import {
  apply,
  chain,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  Tree,
  url,
} from '@angular-devkit/schematics';
import { FixtureOptions } from './fixtures.schema';

export function main(options: FixtureOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return generateFiles(options, context);
  };
}

export function generateFiles(
  options: FixtureOptions,
  context: SchematicContext,
): Rule {
  return (tree: Tree) => {
    const path = options.directory || '.';

    const sourceTemplate = apply(
      url(join('./files' as Path, options.language)),
      [move(path)],
    );

    return chain([mergeWith(sourceTemplate)])(tree, context);
  };
}
