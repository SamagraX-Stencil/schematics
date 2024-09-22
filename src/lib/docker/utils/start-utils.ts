import { Tree, SchematicContext } from '@angular-devkit/schematics';
import { Path, join, normalize } from '@angular-devkit/core';
import { startScriptTemplate } from './start-constants';

export function updateStartScript(tree: Tree, context: SchematicContext, serviceName: string, path: Path): void {
    const resolvedPath = path === "undefined" ? '' as Path : path;
    const startScriptPath = join(normalize('docker-start.sh'));
    const serviceDir = resolvedPath.startsWith('./') ? resolvedPath : `./${resolvedPath}`;

    if (tree.exists(startScriptPath)) {
      const startScriptContent = tree.read(startScriptPath)?.toString('utf-8').trim() || '';
      const newServiceScript = startScriptTemplate(serviceName, resolvedPath,serviceDir);

      if (startScriptContent.includes(`${serviceName.toUpperCase()}_DIR="${serviceDir}"`)) {
        context.logger.info(`docker-start.sh script already includes ${serviceName} service with the same path`);
        return;
      }
      
      if (!startScriptContent.includes(`${serviceName.toUpperCase()}_DIR="${resolvedPath}"`)) {
        const updatedStartScript = startScriptContent + '\n' + newServiceScript.trim();
        tree.overwrite(startScriptPath, updatedStartScript);
        context.logger.info(`docker-start.sh script updated with ${serviceName} service`);
      } else {
        context.logger.info(`docker-start.sh script already includes ${serviceName} service`);
      }
    } else {
      tree.create(startScriptPath, startScriptTemplate(serviceName, resolvedPath,serviceDir).trim());
      context.logger.info(`docker-start.sh script created with ${serviceName} service`);
    }
  }