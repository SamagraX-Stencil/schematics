import { join, Path, strings } from '@angular-devkit/core';
import {
  branchAndMerge,
  chain,
  Rule,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';
import { PrismaOptions } from './prisma.schema';
import { modelsPrisma } from './models.prisma';

export function main(options: PrismaOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return branchAndMerge(chain([addCodeToPrisma(options)]))(tree, context);
  };
}

export function addCodeToPrisma(options: PrismaOptions): Rule {
  return (tree: Tree) => {
    const path = (options.directory || './prisma/schema.prisma') as Path;

    const existingPrismaContent = tree.read(path);

    if (existingPrismaContent) {
      // Read the existing content and convert it to a string.
      const prismaContent = existingPrismaContent.toString('utf-8');

      // Append the modelsPrisma content to the end.
      const updatedPrismaContent = prismaContent + '\n' + modelsPrisma;

      // Write the updated content back to the file.
      tree.overwrite(path, updatedPrismaContent);
    }

    return tree;
  };
}
