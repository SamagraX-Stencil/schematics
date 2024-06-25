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
import { addPackageJsonDependency, getPackageJsonDependency, NodeDependencyType } from '../../utils/dependencies.utils';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

export function main(options: MonitorOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return branchAndMerge(
      chain([addMonitorToModule(options), addPromethiusController(options)]),
    )(tree, context);
  };
}

function addMonitorToModule(options: MonitorOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
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

    console.info('hello from first');

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

    const nodeDependencyRef = getPackageJsonDependency(
      tree,
      '@samagra-x/stencil',
    );
    if (!nodeDependencyRef) {
      addPackageJsonDependency(tree, {
        type: NodeDependencyType.Default,
        name: '@samagra-x/stencil',
        version: '^0.0.6',
      });
      context.addTask(new NodePackageInstallTask());
    }

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
