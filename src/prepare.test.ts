import fs from 'fs';

import prepare from './prepare';
import gitHelpers from './gitHelpers';

describe('prepare.ts', () => {
  describe('default', () => {
    let exitSpy: jest.SpyInstance;
    beforeEach(() => {
      exitSpy = jest.spyOn(process, 'exit');
      exitSpy.mockImplementation((code: number) => code);
    });

    afterEach(() => {
      exitSpy.mockRestore();
    });

    const mockPkg = Buffer.from(JSON.stringify({
      version: '0.1.0',
    }), 'utf8');

    test('should exit with code 1 if no release type is specified', async () => {
      await prepare({});
      expect(exitSpy).toHaveBeenCalledWith(1);
    });

    test('should exit with code 1 if reading package.json throws an error', async () => {
      const readFileSpy = jest.spyOn(fs, 'readFile');
      readFileSpy.mockImplementation(() => {
        throw new Error('readFile had an error');
      });

      await prepare({ major: true, minor: true, patch: true });

      expect(exitSpy).toHaveBeenCalledWith(1);

      readFileSpy.mockRestore();
    });

    test('should exit with code 1 if fetching repository tags fails', async () => {
      const readFileSpy = jest.spyOn(fs, 'readFile');
      readFileSpy.mockImplementation((filePath: string, callback) => {
        return callback(null, mockPkg);
      });

      const allTagsSpy = jest.spyOn(gitHelpers, 'getAllTags');
      allTagsSpy.mockImplementation(async () => {
        throw new Error('getAllTags had an error');
      });

      await prepare({ major: true, minor: true, patch: true });

      expect(exitSpy).toHaveBeenCalledWith(1);
      readFileSpy.mockRestore();
      allTagsSpy.mockRestore();
    });

    test('should exit with code 1 if checking out release branch fails', async () => {
      const readFileSpy = jest.spyOn(fs, 'readFile');
      readFileSpy.mockImplementation((filePath: string, callback) => {
        return callback(null, mockPkg);
      });

      const allTagsSpy = jest.spyOn(gitHelpers, 'getAllTags');
      allTagsSpy.mockImplementation(async () => ['refs/tags/0.2.0']);

      const checkoutSpy = jest.spyOn(gitHelpers, 'checkout');
      checkoutSpy.mockImplementation(async () => {
        throw new Error('Checkout had an error');
      });

      await prepare({ major: true, minor: true, patch: true });

      expect(exitSpy).toHaveBeenCalledWith(1);
      expect(checkoutSpy).toHaveBeenCalledTimes(1);

      readFileSpy.mockRestore();
      allTagsSpy.mockRestore();
      checkoutSpy.mockRestore();
    });

    test('should exit with code 1 if reading the changelog fails', async () => {
      const readFileSpy = jest.spyOn(fs, 'readFile');
      readFileSpy
        .mockImplementationOnce((filePath: string, callback) => {
          return callback(null, mockPkg);
        })
        .mockImplementationOnce(() => {
          throw new Error('Reading changelog had an error');
        });

      const allTagsSpy = jest.spyOn(gitHelpers, 'getAllTags');
      allTagsSpy.mockImplementation(async () => ['refs/tags/0.2.0']);

      const checkoutSpy = jest.spyOn(gitHelpers, 'checkout');
      checkoutSpy.mockImplementation(async () => 'foo');

      const accessSpy = jest.spyOn(fs, 'access');
      accessSpy
        .mockImplementation((filePath: string, opts: any, callback) => {
          return callback(null, true);
        });

      await prepare({ major: false, minor: false, patch: true });

      expect(exitSpy).toHaveBeenCalledWith(1);
      expect(readFileSpy).toHaveBeenCalledTimes(2);
      expect(allTagsSpy).toHaveBeenCalledTimes(1);
      expect(checkoutSpy).toHaveBeenCalledTimes(1);
      expect(accessSpy).toHaveBeenCalledTimes(1);

      readFileSpy.mockRestore();
      allTagsSpy.mockRestore();
      checkoutSpy.mockRestore();
      accessSpy.mockRestore();
    });

    test('should exit with code 1 if writing the changelog fails', async () => {
      const readFileSpy = jest.spyOn(fs, 'readFile');
      readFileSpy
        .mockImplementationOnce((filePath: string, callback) => {
          return callback(null, mockPkg);
        })
        .mockImplementationOnce((filePath: string, callback) => {
          return callback(null, '');
        });

      const allTagsSpy = jest.spyOn(gitHelpers, 'getAllTags');
      allTagsSpy.mockImplementation(async () => ['refs/tags/0.2.0']);

      const checkoutSpy = jest.spyOn(gitHelpers, 'checkout');
      checkoutSpy.mockImplementation(async () => 'foo');

      const accessSpy = jest.spyOn(fs, 'access');
      accessSpy
        .mockImplementation((filePath: string, opts: any, callback) => {
          return callback(null, true);
        });

      const writeFileSpy = jest.spyOn(fs, 'writeFile');
      writeFileSpy
        .mockImplementation(() => {
          throw new Error('Writing changelog had an error');
        });

      await prepare({ major: true, minor: true, patch: false });

      expect(exitSpy).toHaveBeenCalledWith(1);
      expect(readFileSpy).toHaveBeenCalledTimes(2);
      expect(allTagsSpy).toHaveBeenCalledTimes(1);
      expect(checkoutSpy).toHaveBeenCalledTimes(1);
      expect(accessSpy).toHaveBeenCalledTimes(1);
      expect(writeFileSpy).toHaveBeenCalledTimes(1);

      readFileSpy.mockRestore();
      allTagsSpy.mockRestore();
      checkoutSpy.mockRestore();
      accessSpy.mockRestore();
      writeFileSpy.mockRestore();
    });

    test('should exit with code 1 if writing the package.json fails', async () => {
      const readFileSpy = jest.spyOn(fs, 'readFile');
      readFileSpy
        .mockImplementationOnce((filePath: string, callback) => {
          return callback(null, mockPkg);
        })
        .mockImplementationOnce((filePath: string, callback) => {
          return callback(null, '');
        });

      const allTagsSpy = jest.spyOn(gitHelpers, 'getAllTags');
      allTagsSpy.mockImplementation(async () => []);

      const checkoutSpy = jest.spyOn(gitHelpers, 'checkout');
      checkoutSpy.mockImplementation(async () => 'foo');

      const accessSpy = jest.spyOn(fs, 'access');
      accessSpy
        .mockImplementation((filePath: string, opts: any, callback) => {
          return callback(null, true);
        });

      const writeFileSpy = jest.spyOn(fs, 'writeFile');
      writeFileSpy
        .mockImplementationOnce((path: string, contents: string, options: string, callback) => {
          return callback();
        })
        .mockImplementationOnce(() => {
          throw new Error('Writing package.json had an error');
        });

      await prepare({ major: true, minor: true, patch: true });

      expect(exitSpy).toHaveBeenCalledWith(1);
      expect(readFileSpy).toHaveBeenCalledTimes(2);
      expect(allTagsSpy).toHaveBeenCalledTimes(1);
      expect(checkoutSpy).toHaveBeenCalledTimes(1);
      expect(accessSpy).toHaveBeenCalledTimes(1);
      expect(writeFileSpy).toHaveBeenCalledTimes(2);

      readFileSpy.mockRestore();
      allTagsSpy.mockRestore();
      checkoutSpy.mockRestore();
      accessSpy.mockRestore();
      writeFileSpy.mockRestore();
    });

    test('should exit with code 0 if preparing a release is successful', async () => {
      const readFileSpy = jest.spyOn(fs, 'readFile');
      readFileSpy
        .mockImplementationOnce((filePath: string, callback) => {
          return callback(null, mockPkg);
        })
        .mockImplementationOnce((filePath: string, callback) => {
          return callback(null, '');
        });

      const allTagsSpy = jest.spyOn(gitHelpers, 'getAllTags');
      allTagsSpy.mockImplementation(async () => ['refs/tags/blah']);

      const checkoutSpy = jest.spyOn(gitHelpers, 'checkout');
      checkoutSpy.mockImplementation(async () => 'foo');

      const accessSpy = jest.spyOn(fs, 'access');
      accessSpy
        .mockImplementation((filePath: string, opts: any, callback) => {
          return callback(true, null);
        });

      const writeFileSpy = jest.spyOn(fs, 'writeFile');
      writeFileSpy
        .mockImplementationOnce((path: string, contents: string, options: string, callback) => {
          return callback();
        })
        .mockImplementationOnce((path: string, contents: string, options: string, callback) => {
          return callback();
        });

      await prepare({ major: true, minor: true, patch: true });

      expect(exitSpy).toHaveBeenCalledWith(0);
      expect(readFileSpy).toHaveBeenCalledTimes(1); // Should be called once if file doesn't exist
      expect(allTagsSpy).toHaveBeenCalledTimes(1);
      expect(checkoutSpy).toHaveBeenCalledTimes(1);
      expect(accessSpy).toHaveBeenCalledTimes(1);
      expect(writeFileSpy).toHaveBeenCalledTimes(2);

      readFileSpy.mockRestore();
      allTagsSpy.mockRestore();
      checkoutSpy.mockRestore();
      accessSpy.mockRestore();
      writeFileSpy.mockRestore();
    });
  });
});
