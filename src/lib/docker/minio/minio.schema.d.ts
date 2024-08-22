import { Path } from '@angular-devkit/core';

export interface MinioOptions {
  name?: string;
  path?: string | Path;
  directory?: string;
  language?: string;
  sourceRoot?: string;
  flat?: boolean;
}
