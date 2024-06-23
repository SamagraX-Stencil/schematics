import { Path } from '@angular-devkit/core';

export interface HasuraOptions {
  name?: string;
  directory?: string;
  language?: string;
  sourceRoot?: string;
  flat?: boolean;
}
