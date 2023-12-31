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
  mergeWith,
} from '@angular-devkit/schematics';
import {
  DeclarationOptions,
  ModuleDeclarator,
} from '../../utils/module.declarator';
import { ModuleFinder } from '../../utils/module.finder';
import { TemporalServiceOptions } from './service-temporal.schema';
import { import_register } from './imports';

export function main(options: TemporalServiceOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return branchAndMerge(
      chain([
        addImportToModule(options),
        addProviderToModule(options),
        generateTemporalFiles(options, context),
        addActivitiesImport(options),
      ]),
    )(tree, context);
  };
}

function addImportToModule(options: TemporalServiceOptions): Rule {
  return (tree: Tree) => {
    if (!options.path) {
      options.path = './src';
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

function addProviderToModule(options: TemporalServiceOptions): Rule {
  return (tree: Tree) => {
    if (!options.path) {
      options.path = './src';
    }

    let content = tree.read(options.module).toString();
    const declarator: ModuleDeclarator = new ModuleDeclarator();

    // Modify the imports array to include UserModule
    options.path = '@samagra-x/stencil';
    content = declarator.declare(content, {
      name: 'TemporalWorkflowService',
      metadata: 'providers',
      className: 'TemporalWorkflowService',
      path: `@samagra-x/stencil` as Path,
      isPackage: true,
    } as DeclarationOptions);

    tree.overwrite(options.module, content);

    return tree;
  };
}

function generateTemporalFiles(
  options: TemporalServiceOptions,
  context: SchematicContext,
): Rule {
  return (tree: Tree) => {
    const path = '.';
    const sourceTemplate = apply(
      url(join('./files' as Path, options.language)),
      [move(path)],
    );

    return chain([mergeWith(sourceTemplate)])(tree, context);
  };
}

function findImportsEndpoint(contentLines: string[]): number {
  const reversedContent = Array.from(contentLines).reverse();
  const reverseImports = reversedContent.filter((line) =>
    line.match(/\} from ('|")/),
  );
  if (reverseImports.length <= 0) {
    return 0;
  }
  return contentLines.indexOf(reverseImports[0]);
}

function addActivitiesImport(options: TemporalServiceOptions): Rule {
  return (tree: Tree) => {
    // find the last import statement in app.module.ts and add `import * from './temporal/activities' as activities;`
    const modulePath = options.module;
    const moduleContent = tree.read(modulePath).toString();

    const toInsert = `import * as activities from './temporal/activities';`;

    const contentLines = moduleContent.split('\n');
    const finalImportIndex = findImportsEndpoint(contentLines);

    contentLines.splice(finalImportIndex + 1, 0, toInsert);

    tree.overwrite(modulePath, contentLines.join('\n'));
    return tree;
  };
}
