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
import { ServiceOptions } from './service-user.schema';

export function main(options: ServiceOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return branchAndMerge(chain([addImportToModule(options)]))(tree, context);
  };
}

function addImportToModule(options: ServiceOptions): Rule {
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
    options.path = '@techsavvyash/user-service';
    content = declarator.declare(content, {
      name: 'user',
      metadata: 'imports',
      className: 'user.UserModule',
      path: `@techsavvyash/user-service` as Path,
      isPackage: true,
    } as DeclarationOptions);

    tree.overwrite(options.module, content);

    return tree;
  };
}
