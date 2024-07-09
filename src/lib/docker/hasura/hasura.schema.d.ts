import { Path } from '@angular-devkit/core';

export interface HasuraOptions {
  name?: string;
  path?: string | Path;
  directory?: string;
  language?: string;
  sourceRoot?: string;
  flat?: boolean;
}
