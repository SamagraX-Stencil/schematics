import { Path } from '@angular-devkit/core';

export interface PullOptions {
  name?: string;
  directory?: string;
  language?: string;
  sourceRoot?: string;
  flat?: boolean;
}
