import { Path } from '@angular-devkit/core';

export interface TemporalServiceOptions {
  /**
   * The path to create the service.
   */
  path?: string;
  /**
   * The path to insert the service declaration.
   */
  module?: Path;
  /**
   * Metadata name affected by declaration insertion.
   */
  metadata?: string;
  /**
   * Nest element type name
   */
  type?: string;
  /**
   * The source root path
   */
  sourceRoot?: string;
  flat?: boolean;
  language?: string;
}
