import { Path, join, normalize } from '@angular-devkit/core';
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

const minioServiceConfig = `
    image: minio/minio:latest
    container_name: minio
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: \${MINIO_ROOT_USER}
      MINIO_ROOT_PASSWORD: \${MINIO_ROOT_PASSWORD}
    command: server /data --console-address ":9001"
    volumes:
    - minio_data:/data
`;

const minioVolumeConfig = "minio_data";

const minioEnvContent = `
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin
`;

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
