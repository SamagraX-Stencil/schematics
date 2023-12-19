import { Path } from '@angular-devkit/core';

export interface GithubOptions {
  name?: string;
  directory?: string;
  language?: string;
  sourceRoot?: string;
  flat?: boolean;
}
