import { normalize } from '@angular-devkit/core';
import { ModuleImportDeclarator } from '../../src/utils/module-import.declarator';
import { DeclarationOptions } from '../../src/utils/module.declarator';

describe('Module Import Declarator', () => {
  it('should add import to the buffered module content', () => {
    const content: string =
      "import { Module } from '@nestjs/common';\n" +
      '\n' +
      '@Module({})\n' +
      'export class FooModule {}\n';
    const options: DeclarationOptions = {
      metadata: 'imports',
      type: 'module',
      name: 'bar',
      path: normalize('/src/foo/bar'),
      module: normalize('/src/foo/foo.module.ts'),
      symbol: 'BarModule',
      isPackage: false
    };
    const declarator = new ModuleImportDeclarator();
    expect(declarator.declare(content, options)).toEqual(
      "import { Module } from '@nestjs/common';\n" +
        "import { BarModule } from './bar/bar.module';\n" +
        '\n' +
        '@Module({})\n' +
        'export class FooModule {}\n',
    );
  });

  it('should manage no type', () => {
    const content: string =
      "import { Module } from '@nestjs/common';\n" +
      '\n' +
      '@Module({})\n' +
      'export class FooModule {}\n';
    const options: DeclarationOptions = {
      metadata: 'providers',
      name: 'foo',
      path: normalize('/src/foo'),
      module: normalize('/src/foo/foo.ts'),
      symbol: 'Foo',
      isPackage: false
    };
    const declarator = new ModuleImportDeclarator();
    expect(declarator.declare(content, options)).toEqual(
      "import { Module } from '@nestjs/common';\n" +
        "import { Foo } from './foo';\n" +
        '\n' +
        '@Module({})\n' +
        'export class FooModule {}\n',
    );
  });

  it('should not break existing multi-line imports', () => {
    const content: string =
      'import {\n' +
      '  Module,\n' +
      '  Helper,\n' +
      "} from '@nestjs/common';\n" +
      '\n' +
      '@Helper()\n' +
      '@Module({})\n' +
      'export class FooModule {}\n';

    const options: DeclarationOptions = {
      metadata: 'imports',
      type: 'module',
      name: 'bar',
      path: normalize('/src/foo/bar'),
      module: normalize('/src/foo/foo.module.ts'),
      symbol: 'BarModule',
      isPackage: false
    };
    const declarator = new ModuleImportDeclarator();
    expect(declarator.declare(content, options)).toEqual(
      'import {\n' +
        '  Module,\n' +
        '  Helper,\n' +
        "} from '@nestjs/common';\n" +
        "import { BarModule } from './bar/bar.module';\n" +
        '\n' +
        '@Helper()\n' +
        '@Module({})\n' +
        'export class FooModule {}\n',
    );
  });

  it('should not break on match of "from" in another context', () => {
    const content: string =
      'import {\n' +
      '  Module,\n' +
      '  Helper,\n' +
      "} from '@nestjs/common';\n" +
      '\n' +
      '@Helper()\n' +
      '@Module({})\n' +
      'const x = " from ";\n' +
      'console.error(" from ");\n' +
      'export class FooModule {}\n';

    const options: DeclarationOptions = {
      metadata: 'imports',
      type: 'module',
      name: 'bar',
      path: normalize('/src/foo/bar'),
      module: normalize('/src/foo/foo.module.ts'),
      symbol: 'BarModule',
      isPackage: false
    };
    const declarator = new ModuleImportDeclarator();
    expect(declarator.declare(content, options)).toEqual(
      'import {\n' +
        '  Module,\n' +
        '  Helper,\n' +
        "} from '@nestjs/common';\n" +
        "import { BarModule } from './bar/bar.module';\n" +
        '\n' +
        '@Helper()\n' +
        '@Module({})\n' +
        'const x = " from ";\n' +
        'console.error(" from ");\n' +
        'export class FooModule {}\n',
    );
  }
);
it('should not break if same package already exists', () => {
  const content: string =
      "import { Module } from '@nestjs/common';\n" +
      "import { TestModule } from '@samagra-x/stencil';\n" +
      '\n' +
      '@Module({})\n' +
      'const x = " from ";\n' +
      'console.error(" from ");\n' +
      'export class FooModule {}\n';
    const options: DeclarationOptions = {
      metadata: 'imports',
      name: 'module',
      path: normalize('@samagra-x/stencil'),
      module: normalize('/src/foo/foo.module.ts'),
      symbol: 'Foo',
      isPackage: false
    };
    const declarator = new ModuleImportDeclarator();
    expect(declarator.declare(content, options)).toEqual(
      "import { Module } from '@nestjs/common';\n" +
      "import { TestModule, Foo } from '@samagra-x/stencil';\n" +
        '\n' +
        '@Module({})\n' +
        'const x = " from ";\n' +
        'console.error(" from ");\n' +
        'export class FooModule {}\n',
    );
  });

  it('should not break for different quote chars', () => {
    const content: string =
        "import { Module } from '@nestjs/common';\n" +
        "import { TestModule } from \"@samagra-x/stencil\" ;\n" +
        '\n' +
        '@Module({})\n' +
        'const x = " from ";\n' +
        'console.error(" from ");\n' +
        'export class FooModule {}\n';
      const options: DeclarationOptions = {
        metadata: 'imports',
        name: 'Foo',
        path: normalize('@samagra-x/stencil'),
        module: normalize('/src/foo/foo.module.ts'),
        symbol: 'Foo',
        isPackage: true
      };
      const declarator = new ModuleImportDeclarator();
      expect(declarator.declare(content, options)).toEqual(
        "import { Module } from '@nestjs/common';\n" +
        "import { TestModule, Foo } from '@samagra-x/stencil';\n" +
          '\n' +
          '@Module({})\n' +
          'const x = " from ";\n' +
          'console.error(" from ");\n' +
          'export class FooModule {}\n',
      );
    });

    it('should not break if alias is present', () => {
      const content: string =
          "import { Module } from '@nestjs/common';\n" +
          "import { TestModule } from '@samagra-x/stencil';\n" +
          '\n' +
          '@Module({})\n' +
          'const x = " from ";\n' +
          'console.error(" from ");\n' +
          'export class FooModule {}\n';
        const options: DeclarationOptions = {
          metadata: 'imports',
          name: 'module',
          path: normalize('@samagra-x/stencil'),
          module: normalize('/src/foo/foo.module.ts'),
          symbol: 'Foo as F',
          isPackage: false
        };
        const declarator = new ModuleImportDeclarator();
        expect(declarator.declare(content, options)).toEqual(
          "import { Module } from '@nestjs/common';\n" +
          "import { TestModule, Foo as F } from '@samagra-x/stencil';\n" +
            '\n' +
            '@Module({})\n' +
            'const x = " from ";\n' +
            'console.error(" from ");\n' +
            'export class FooModule {}\n',
        );
      });  
});
