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
  mergeWith
} from '@angular-devkit/schematics';
import {
  DeclarationOptions,
  ModuleDeclarator,
} from '../../utils/module.declarator';
import { ModuleFinder } from '../../utils/module.finder';
import { TemporalServiceOptions } from './service-temporal.schema';
import { import_register } from './inports'

export function main(options: TemporalServiceOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return branchAndMerge(chain([addImportToModule(options), addProviderToModule(options), generateTemporalFiles(options, context)]))(tree, context);
  };
}

function addImportToModule(options: TemporalServiceOptions): Rule {
  return (tree: Tree) => {
    if (!options.path) {
      options.path = '/src';
    }
    options.module = new ModuleFinder(tree).find({
      path: options.path as Path,
    });

    if (!options.module) {
      console.error('App module not found. Could not Initialise the service');
      return tree;
    }

    let content = tree.read(options.module).toString();
    const declarator: ModuleDeclarator = new ModuleDeclarator();

    // Modify the imports array to include UserModule
    options.path = 'nestjs-temporal';
    content = declarator.declare(content, {
      name: 'TemporalModule',
      metadata: 'imports',
      className: import_register,
      path: `nestjs-temporal` as Path,
      isPackage: true,
    } as DeclarationOptions);

    tree.overwrite(options.module, content);

    return tree;
  };
}

export function addProviderToModule(options: TemporalServiceOptions): Rule {
  return (tree: Tree) => {
    if (!options.path) {
      options.path = '/src';
    }
    options.module = new ModuleFinder(tree).find({
      path: options.path as Path,
    });

    if (!options.module) {
      console.error('App module not found. Could not Initialise the service');
      return tree;
    }

    let content = tree.read(options.module).toString();
    const declarator: ModuleDeclarator = new ModuleDeclarator();

    // Modify the imports array to include UserModule
    options.path = '@samagra-x/stencil';
    content = declarator.declare(content, {
      name: 'TemporalWorkflowService',
      metadata: 'providers',
      className: "TemporalWorkflowService",
      path: `@samagra-x/stencil` as Path,
      isPackage: true,
    } as DeclarationOptions);

    tree.overwrite(options.module, content);

    return tree;
  };
}

export function generateTemporalFiles(
  options: TemporalServiceOptions,
  context: SchematicContext,
): Rule {
  return (tree: Tree) => {
    const path = './src/';

    const sourceTemplate = apply(
      url(join('./files' as Path, options.language)),
      [move(path)],
    );

    return chain([mergeWith(sourceTemplate)])(tree, context);
  };
}