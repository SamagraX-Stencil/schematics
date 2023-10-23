import { Path } from '@angular-devkit/core';
import { capitalize, classify } from '@angular-devkit/core/src/utils/strings';
import { ModuleImportDeclarator } from './module-import.declarator';
import { ModuleMetadataDeclarator } from './module-metadata.declarator';

export interface DeclarationOptions {
  metadata: string;
  type?: string;
  name: string; //this is the name added in the import statement(when using package)
  className?: string; //this is the name which is added in the imports array of a module
  path: Path; //this is the path/the npm package name
  module: Path;
  symbol?: string; //this is added in top import statement and import array under normal circumstances
  staticOptions?: {
    name: string;
    value: Record<string, any>;
  };
  isPackage: boolean; //if it is a custom npm package, then we have different initialisation
}

export class ModuleDeclarator {
  constructor(
    private imports: ModuleImportDeclarator = new ModuleImportDeclarator(),
    private metadata: ModuleMetadataDeclarator = new ModuleMetadataDeclarator(),
  ) {}

  public declare(content: string, options: DeclarationOptions): string {
    options = this.computeSymbol(options);
    content = this.imports.declare(content, options);
    content = this.metadata.declare(content, options);
    return content;
  }

  private computeSymbol(options: DeclarationOptions): DeclarationOptions {
    const target = Object.assign({}, options);
    if (options.className) {
      target.symbol = options.className;
    } else if (options.type !== undefined) {
      target.symbol = classify(options.name).concat(capitalize(options.type));
    } else {
      target.symbol = classify(options.name);
    }
    return target;
  }
}
