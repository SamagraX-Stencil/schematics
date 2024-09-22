import { Path } from '@angular-devkit/core';

export const startScriptTemplate = (serviceName: string, respath: Path,serviceDir: string) => {

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
  