import { Path } from '@angular-devkit/core';

export interface DevcontainerOptions {
  name?: string;
  directory?: string;
  language?: string;
  sourceRoot?: string;
  flat?: boolean;
}
