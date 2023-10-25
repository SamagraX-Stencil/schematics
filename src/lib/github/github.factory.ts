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
import { GithubOptions } from './github.schema';

export function main(options: GithubOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return generateGithubFiles(options, context);
  };
}

export function generateGithubFiles(
  options: GithubOptions,
  context: SchematicContext,
): Rule {
  return (tree: Tree) => {
    const path = options.directory || './.github';

    const sourceTemplate = apply(
      url(join('./files' as Path, options.language)),
      [move(path)],
    );

    return chain([mergeWith(sourceTemplate)])(tree, context);
  };
}
