import { Tree, SchematicContext } from '@angular-devkit/schematics';
import * as yaml from 'yaml';

export function addService(
  tree: Tree,
  context: SchematicContext,
  sectionName: string,
  entryName: string,
  entryConfig: any,
  composeFilePath: string
): void {
  if (tree.exists(composeFilePath)) {
    const composeFileContent = tree.read(composeFilePath)?.toString('utf-8');
    let composeFile = yaml.parse(composeFileContent || '');

    if (!composeFile[sectionName]) {
      composeFile[sectionName] = {};
    }

    if (!(entryName in composeFile[sectionName])) {
      composeFile[sectionName][entryName] = typeof entryConfig === 'string' ? yaml.parse(entryConfig) : entryConfig;

      const updatedComposeFile = yaml.stringify(composeFile, { indent: 2 });
      tree.overwrite(composeFilePath, updatedComposeFile);
      context.logger.info(`${entryName} added to ${sectionName} in docker-compose.yml`);
    } else {
      context.logger.info(`${entryName} already exists in ${sectionName} in docker-compose.yml`);
    }
  } else {
    const newComposeFile = {
      [sectionName]: {
        [entryName]: typeof entryConfig === 'string' ? yaml.parse(entryConfig) : entryConfig
      }
    };

    const newComposeFileContent = yaml.stringify(newComposeFile, { indent: 2 });
    tree.create(composeFilePath, newComposeFileContent);
    context.logger.info(`docker-compose.yml created with ${entryName} in ${sectionName}`);
  }
}
