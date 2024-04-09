import { normalize, Path } from '@angular-devkit/core';
import { DeclarationOptions } from './module.declarator';
import { PathSolver } from './path.solver';

export class ModuleImportDeclarator {
  constructor(private solver: PathSolver = new PathSolver()) {}

  public declare(content: string, options: DeclarationOptions): string {
    const toInsert = this.buildLineToInsert(options);
    const contentLines = content.split('\n');
    const finalImportIndex = this.findImportsEndpoint(contentLines);
    const updatedContent = this.mergeImportStatements(contentLines, finalImportIndex, toInsert,options);
    return updatedContent.join('\n');
}

private mergeImportStatements(contentLines: string[], finalImportIndex: number, toInsert: string, options: DeclarationOptions): string[] {
  const existingImportLineIndex = contentLines.findIndex(line =>
    line.startsWith(`import {`) && line.includes(`} from '${options.path}';`)
  );

  if (existingImportLineIndex !== -1) {
    const existingImportLine = contentLines[existingImportLineIndex];
    const startIndex = existingImportLine.indexOf('{') + 2;
    const endIndex = existingImportLine.lastIndexOf('}');

    const existingSymbols = existingImportLine.substring(startIndex, endIndex).trim().split(',').map(symbol => symbol.trim());
    const newSymbols = toInsert.substring(toInsert.indexOf('{') + 1, toInsert.lastIndexOf('}')).trim().split(',').map(symbol => symbol.trim());
    
    const mergedSymbols = [...new Set(existingSymbols.concat(newSymbols))]; 
    
    const updatedImportLine = existingImportLine.substring(0, startIndex) +
                              mergedSymbols.join(', ') +
                              existingImportLine.substring(endIndex);

    contentLines[existingImportLineIndex] = updatedImportLine;
  } else {
    contentLines.splice(finalImportIndex + 1, 0, toInsert);
  }
  return contentLines;
}
  private findImportsEndpoint(contentLines: string[]): number {
    const reversedContent = Array.from(contentLines).reverse();
    const reverseImports = reversedContent.filter((line) =>
      line.match(/\} from ('|")/),
    );
    if (reverseImports.length <= 0) {
      return 0;
    }
    return contentLines.indexOf(reverseImports[0]);
  }

  private buildLineToInsert(options: DeclarationOptions): string {
    if (options.isPackage) {
      return `import { ${options.name} } from '${options.path}';`;
    }
    return `import { ${options.symbol} } from '${this.computeRelativePath(
      options,
    )}';`;
  }

  private computeRelativePath(options: DeclarationOptions): string {
    let importModulePath: Path;
    console.info('at start', importModulePath);
    if (options.type !== undefined) {
      importModulePath = normalize(
        `/${options.path}/${options.name}.${options.type}`,
      );
    } else {
      importModulePath = normalize(`/${options.path}/${options.name}`);
    }
    console.info('at end', importModulePath);
    return this.solver.relative(options.module, importModulePath);
  }
}
