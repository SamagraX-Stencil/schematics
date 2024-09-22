import { Tree, SchematicContext } from '@angular-devkit/schematics';

export function addEnvFile(tree: Tree, context: SchematicContext,serviceName: string, envFilePath: string,envContent:string): void {

    if (tree.exists(envFilePath)) {
        let currentEnvContent = tree.read(envFilePath)?.toString('utf-8').trim() || '';
        const newEnvVars = envContent.trim().split('\n').filter(line => {
          const [key] = line.split('=');
          return !currentEnvContent.includes(`${key}=`);
        }).join('\n');
  
        if (newEnvVars) {
          currentEnvContent += `\n${newEnvVars}`;
          tree.overwrite(envFilePath, currentEnvContent.trim());
          context.logger.info(`${serviceName} environment variables added to .env file`);
        } else {
          context.logger.info(`${serviceName} environment variables already exist in .env file`);
        }
      } else {
        tree.create(envFilePath, envContent.trim());
        context.logger.info(`.env file created with ${serviceName} environment variables`);
      }
    }