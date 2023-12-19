import { Path } from '@angular-devkit/core';

export interface ServiceOptions {
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
}
