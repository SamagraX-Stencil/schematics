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
import { DevcontainerOptions } from './devcontainer.schema';

export function main(options: DevcontainerOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return generateDevcontainerFiles(options, context);
  };
}

export function generateDevcontainerFiles(
  options: DevcontainerOptions,
  context: SchematicContext,
): Rule {
  return (tree: Tree) => {
    const path = options.directory || './.devcontainer';

    const sourceTemplate = apply(
      url(join('./files' as Path, options.language)),
      [move(path)],
    );

    return chain([mergeWith(sourceTemplate)])(tree, context);
  };
}
