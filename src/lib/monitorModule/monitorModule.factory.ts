import { Path } from '@angular-devkit/core';
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
    return branchAndMerge(
      chain([addMonitorToModule(options), addPromethiusController(options)]),
    )(tree, context);
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
      console.error('App module not found. Could not add monitor');
      return tree;
    }

    let content = tree.read(options.module).toString();
    const declarator: ModuleDeclarator = new ModuleDeclarator();

    // Modify the imports array to include monitoringModule
    options.path = '@samagra-x/stencil';
    content = declarator.declare(content, {
      name: 'MonitoringModule',
      metadata: 'imports',
      className: 'MonitoringModule',
      path: `@samagra-x/stencil` as Path,
      isPackage: true,
    } as DeclarationOptions);

    tree.overwrite(options.module, content);

    return tree;
  };
}

function addPromethiusController(options: MonitorOptions): Rule {
  return (tree: Tree) => {
    const content = tree.read(options.module).toString();
    const declarator: ModuleDeclarator = new ModuleDeclarator();

    options.path = '@samagra-x/stencil';
    const updatedContent = declarator.declare(content, {
      name: 'PrometheusController',
      metadata: 'controllers',
      className: 'PrometheusController',
      path: `@samagra-x/stencil` as Path,
      isPackage: true,
    } as DeclarationOptions);
    tree.overwrite(options.module, updatedContent);

    return tree;
  };
}
