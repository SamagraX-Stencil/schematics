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
import { FusionAuthOptions } from './fusionauth.schema';
import { addService } from '../utils/addService-utils';
import { addEnvFile } from '../utils/addEnv-utils';
import { fusionauthServiceConfig, fusionauthVolumeConfig, fusionauthEnvContent } from './fusionauth-constants';

export function main(options: FusionAuthOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return branchAndMerge(
      chain([
        generateBasicFiles(options, context),
      ]),
    )(tree, context);
  };
}

function generateBasicFiles(
  options: FusionAuthOptions,
  context: SchematicContext,
): Rule {
  return (tree: Tree) => {
    return chain([
      addFusionAuthService(options),
    ])(tree, context);
  };
}

function addFusionAuthService(options: FusionAuthOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    options.path = options.path === "undefined" ? "" : options.path;
    
    const composeFilePath = join(options.path as Path,normalize('docker-compose.yml'));
    const envFilePath = join(options.path as Path,normalize('.env'));

    addService(tree, context,'services', 'fusionauth',fusionauthServiceConfig,composeFilePath );
    addService(tree, context,'volumes', fusionauthVolumeConfig,{},composeFilePath );

    addEnvFile(tree, context,'Fusionauth', envFilePath, fusionauthEnvContent);

    updateStartScript(tree, context, 'fusionauth', options.path as Path);

    return tree;
  };
}
