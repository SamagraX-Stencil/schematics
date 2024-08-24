import { Tree, SchematicContext } from '@angular-devkit/schematics';
import { Path, join, normalize } from '@angular-devkit/core';

const startScriptTemplate = (serviceName: string, respath: Path,serviceDir: string) => {

  const changeDirCommands = serviceDir !== './' ? "cd " + respath.split('/').map(() => '../').join('') : '';
  return `
  
${serviceName.toUpperCase()}_DIR="${serviceDir}"

if [ -d $${serviceName.toUpperCase()}_DIR ]; then
  cd $${serviceName.toUpperCase()}_DIR
  docker compose up -d
  ${changeDirCommands}
fi

`;
};

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