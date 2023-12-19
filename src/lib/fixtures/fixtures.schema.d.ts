import { Path } from '@angular-devkit/core';

export interface FixtureOptions {
  name?: string;
  directory?: string;
  language?: string;
  sourceRoot?: string;
  flat?: boolean;
}
