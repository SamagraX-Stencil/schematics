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
import { HuskyOptions } from './husky.schema';
import { preCommit } from './pre-commit';

export function main(options: HuskyOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return generateFiles(options);
  };
}

export function generateFiles(options: HuskyOptions): Rule {
  return (tree: Tree) => {
    const path = options.directory || './.husky';

    const preCommitPath = join(path as Path, 'pre-commit');
    tree.create(preCommitPath, preCommit);
    return tree;
  };
}
