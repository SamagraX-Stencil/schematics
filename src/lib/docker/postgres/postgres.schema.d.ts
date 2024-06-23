import { Path } from '@angular-devkit/core';

export interface PostgresOptions {
  name?: string;
  directory?: string;
  language?: string;
  sourceRoot?: string;
  flat?: boolean;
}
