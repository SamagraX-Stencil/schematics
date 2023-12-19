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
import { FixtureOptions } from './fixtures.schema';
import { dockerfileContent } from './dockerfileContent';

export function main(options: FixtureOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return generateFiles(options, context);
  };
}

export function generateFiles(
  options: FixtureOptions,
  context: SchematicContext,
): Rule {
  return (tree: Tree) => {
    const path = options.directory || '.';

    const sourceTemplate = apply(
      url(join('./files' as Path, options.language)),
      [move(path)],
    );

    return chain([
      mergeWith(sourceTemplate),
      createDockerfile(options, path), // Call createDockerfile function here
    ])(tree, context);
  };
}

function createDockerfile(options: FixtureOptions, path: string): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const dockerfilePath = `${path}/Dockerfile`;

    tree.create(dockerfilePath, dockerfileContent);

    context.logger.info(`File "${dockerfilePath}" created successfully.`);

    return tree;
  };
}
