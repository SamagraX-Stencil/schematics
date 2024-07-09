import { Tree, SchematicContext } from '@angular-devkit/schematics';

export function addService(tree: Tree, context: SchematicContext,serviceName: string, serviceConfig: string,composeFilePath:string): void {
    if (tree.exists(composeFilePath)) {
        const composeFile = tree.read(composeFilePath)?.toString('utf-8');
        if (!composeFile?.includes('services:') || !composeFile.includes(`${serviceName}:`)) {
          let updatedComposeFile = composeFile || '';
          if (!composeFile?.includes('services:')) {
            updatedComposeFile += `services:\n`;
          }
  
          updatedComposeFile += `${serviceConfig}`;
          tree.overwrite(composeFilePath, updatedComposeFile);
          context.logger.info(`${serviceName} service added to docker-compose.yml`);
        } else {
          context.logger.info(`${serviceName} service already exists in docker-compose.yml`);
        }
      } else {
        const newComposeFile = `services:\n${serviceConfig}`;
        tree.create(composeFilePath, newComposeFile);
        context.logger.info(`docker-compose.yml created with ${serviceName} service`);
      }
  
    }