import { Path, join, normalize } from '@angular-devkit/core';
import { minioServiceConfig, minioVolumeConfig, minioEnvContent } from './minio-constants';
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
  Source,
} from '@angular-devkit/schematics';
import { updateStartScript } from '../utils/start-utils';
import { MinioOptions } from './minio.schema';
import { addService } from '../utils/addService-utils';
import { addEnvFile } from '../utils/addEnv-utils';

export function main(options: MinioOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return branchAndMerge(
      chain([
        generateBasicFiles(options, context),
      ]),
    )(tree, context);
  };
}

function generateBasicFiles(
  options: MinioOptions,
  context: SchematicContext,
): Rule {
  return (tree: Tree) => {
    return chain([
      addMinioService(options),
    ])(tree, context);
  };
}

function addMinioService(options: MinioOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    options.path = options.path === "undefined" ? "" : options.path;
    
    const composeFilePath = join(options.path as Path,normalize('docker-compose.yml'));
    const envFilePath = join(options.path as Path,normalize('.env'));

    addService(tree, context,'services', 'minio',minioServiceConfig,composeFilePath );
    addService(tree, context,'volumes', minioVolumeConfig,{},composeFilePath );

    addEnvFile(tree, context,'Minio', envFilePath, minioEnvContent);

    updateStartScript(tree, context, 'minio', options.path as Path);

    return tree;
  };
}
