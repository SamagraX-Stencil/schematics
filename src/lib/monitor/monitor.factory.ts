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
import { MonitorOptions } from './monitor.schema';

export function main(options: MonitorOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return generateMonitorFiles(options, context);
  };
}

export function generateMonitorFiles(
  options: MonitorOptions,
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
