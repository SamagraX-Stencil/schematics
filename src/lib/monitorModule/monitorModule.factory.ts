import { join, Path, strings } from '@angular-devkit/core';
import {
  branchAndMerge,
  chain,
  Rule,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';
import {
  DeclarationOptions,
  ModuleDeclarator,
} from '../../utils/module.declarator';
import { ModuleFinder } from '../../utils/module.finder';
import { MonitorOptions } from './monitorModule.schema';

export function main(options: MonitorOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return branchAndMerge(chain([addMonitorToModule(options)]))(tree, context);
  };
}

function addMonitorToModule(options: MonitorOptions): Rule {
  return (tree: Tree) => {
    if (!options.path) {
      options.path = '/src';
    }
    options.module = new ModuleFinder(tree).find({
      path: options.path as Path,
    });

    if (!options.module) {
      console.error(
        'App module not found. Could not add the service (monitor)',
      );
      return tree;
    }

    let content = tree.read(options.module).toString();
    const declarator: ModuleDeclarator = new ModuleDeclarator();

    // Modify the imports array to include monitoringModule
    options.path = '@techsavvyash/nestjs-monitor';
    content = declarator.declare(content, {
      name: 'MonitoringModule',
      metadata: 'imports',
      className: 'MonitoringModule',
      path: `@techsavvyash/nestjs-monitor` as Path,
      isPackage: true,
    } as DeclarationOptions);

    tree.overwrite(options.module, content);

    let promethiusContent = tree.read(options.module).toString();
    const promethiusDeclarator: ModuleDeclarator = new ModuleDeclarator();

    // Modify the imports array to register promethius
    options.path = '@willsoto/nestjs-prometheus';
    promethiusContent = promethiusDeclarator.declare(promethiusContent, {
      name: 'PrometheusModule',
      metadata: 'imports',
      className: `PrometheusModule.register({
      defaultMetrics: {
        enabled: false,
      },
    }),`,
      path: `@willsoto/nestjs-prometheus` as Path,
      isPackage: true,
    } as DeclarationOptions);

    tree.overwrite(options.module, promethiusContent);

    return tree;
  };
}
