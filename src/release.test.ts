import fs from 'fs';

import release from './release';
import gitHelpers from './gitHelpers';

describe('release.ts', () => {
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

    test('should exit with code 1 if reading package.json fails', async () => {
      const readFileSpy = jest.spyOn(fs, 'readFile');
      readFileSpy
        .mockImplementation(() => {
          throw new Error('Reading package.json had an error');
        });

      await release();

      expect(exitSpy).toHaveBeenCalledWith(1);
      expect(readFileSpy).toHaveBeenCalledTimes(1);

      readFileSpy.mockRestore();
    });

    test('should exit with code 1 if pulling master fails', async () => {
      const readFileSpy = jest.spyOn(fs, 'readFile');
      readFileSpy
        .mockImplementation((filePath: string, callback) => {
          return callback(null, mockPkg);
        });

      const checkoutSpy = jest.spyOn(gitHelpers, 'checkout');
      checkoutSpy.mockImplementationOnce(async () => {
        throw new Error('Pulling develop had an error');
      });

      await release();

      expect(exitSpy).toHaveBeenCalledWith(1);
      expect(readFileSpy).toHaveBeenCalledTimes(1);
      expect(checkoutSpy).toHaveBeenCalledTimes(1);

      readFileSpy.mockRestore();
      checkoutSpy.mockRestore();
    });

    test('should exit with code 1 if merging release with develop fails', async () => {
      const readFileSpy = jest.spyOn(fs, 'readFile');
      readFileSpy
        .mockImplementation((filePath: string, callback) => {
          return callback(null, mockPkg);
        });

      const checkoutSpy = jest.spyOn(gitHelpers, 'checkout');
      checkoutSpy.mockImplementation(async () => null);

      const mergeSpy = jest.spyOn(gitHelpers, 'merge');
      mergeSpy.mockImplementation(async () => {
        throw new Error('Merging master had an error');
      });

      await release();

      expect(exitSpy).toHaveBeenCalledWith(1);
      expect(readFileSpy).toHaveBeenCalledTimes(1);
      expect(checkoutSpy).toHaveBeenCalledTimes(1);
      expect(mergeSpy).toHaveBeenCalledTimes(1);

      readFileSpy.mockRestore();
      checkoutSpy.mockRestore();
      mergeSpy.mockRestore();
    });

    test('should exit with code 1 if pushing master fails', async () => {
      const readFileSpy = jest.spyOn(fs, 'readFile');
      readFileSpy
        .mockImplementation((filePath: string, callback) => {
          return callback(null, mockPkg);
        });

      const checkoutSpy = jest.spyOn(gitHelpers, 'checkout');
      checkoutSpy.mockImplementation(async () => null);

      const mergeSpy = jest.spyOn(gitHelpers, 'merge');
      mergeSpy.mockImplementation(async () => null);

      const pushSpy = jest.spyOn(gitHelpers, 'push');
      pushSpy.mockImplementation(async () => {
        throw new Error('Pushing develop had an error');
      });

      await release();

      expect(exitSpy).toHaveBeenCalledWith(1);
      expect(readFileSpy).toHaveBeenCalledTimes(1);
      expect(checkoutSpy).toHaveBeenCalledTimes(1);
      expect(mergeSpy).toHaveBeenCalledTimes(1);
      expect(pushSpy).toHaveBeenCalledTimes(1);

      readFileSpy.mockRestore();
      checkoutSpy.mockRestore();
      mergeSpy.mockRestore();
      pushSpy.mockRestore();
    });

    test('should exit with code 1 if pulling master fails', async () => {
      const readFileSpy = jest.spyOn(fs, 'readFile');
      readFileSpy
        .mockImplementation((filePath: string, callback) => {
          return callback(null, mockPkg);
        });

      const checkoutSpy = jest.spyOn(gitHelpers, 'checkout');
      checkoutSpy
        .mockImplementationOnce(async () => null)
        .mockImplementationOnce(async () => {
          throw new Error('Pulling master had an error');
        });

      const mergeSpy = jest.spyOn(gitHelpers, 'merge');
      mergeSpy.mockImplementation(async () => null);

      const pushSpy = jest.spyOn(gitHelpers, 'push');
      pushSpy.mockImplementation(async () => null);

      await release();

      expect(exitSpy).toHaveBeenCalledWith(1);
      expect(readFileSpy).toHaveBeenCalledTimes(1);
      expect(checkoutSpy).toHaveBeenCalledTimes(2);
      expect(mergeSpy).toHaveBeenCalledTimes(1);
      expect(pushSpy).toHaveBeenCalledTimes(1);

      readFileSpy.mockRestore();
      checkoutSpy.mockRestore();
      mergeSpy.mockRestore();
      pushSpy.mockRestore();
    });

    test('should exit with code 1 if merging release with master fails', async () => {
      const readFileSpy = jest.spyOn(fs, 'readFile');
      readFileSpy
        .mockImplementation((filePath: string, callback) => {
          return callback(null, mockPkg);
        });

      const checkoutSpy = jest.spyOn(gitHelpers, 'checkout');
      checkoutSpy.mockImplementation(async () => null);

      const mergeSpy = jest.spyOn(gitHelpers, 'merge');
      mergeSpy
        .mockImplementationOnce(async () => null)
        .mockImplementationOnce(async () => {
          throw new Error('Merging master had an error');
        });

      const pushSpy = jest.spyOn(gitHelpers, 'push');
      pushSpy.mockImplementation(async () => null);

      await release();

      expect(exitSpy).toHaveBeenCalledWith(1);
      expect(readFileSpy).toHaveBeenCalledTimes(1);
      expect(checkoutSpy).toHaveBeenCalledTimes(2);
      expect(mergeSpy).toHaveBeenCalledTimes(2);
      expect(pushSpy).toHaveBeenCalledTimes(1);

      readFileSpy.mockRestore();
      checkoutSpy.mockRestore();
      mergeSpy.mockRestore();
      pushSpy.mockRestore();
    });

    test('should exit with code 1 if pushing master fails', async () => {
      const readFileSpy = jest.spyOn(fs, 'readFile');
      readFileSpy
        .mockImplementation((filePath: string, callback) => {
          return callback(null, mockPkg);
        });

      const checkoutSpy = jest.spyOn(gitHelpers, 'checkout');
      checkoutSpy.mockImplementation(async () => null);

      const mergeSpy = jest.spyOn(gitHelpers, 'merge');
      mergeSpy.mockImplementation(async () => null);

      const pushSpy = jest.spyOn(gitHelpers, 'push');
      pushSpy
        .mockImplementationOnce(async () => null)
        .mockImplementationOnce(async () => {
          throw new Error('Pushing master had an error');
        });

      await release();

      expect(exitSpy).toHaveBeenCalledWith(1);
      expect(readFileSpy).toHaveBeenCalledTimes(1);
      expect(checkoutSpy).toHaveBeenCalledTimes(2);
      expect(mergeSpy).toHaveBeenCalledTimes(2);
      expect(pushSpy).toHaveBeenCalledTimes(2);

      readFileSpy.mockRestore();
      checkoutSpy.mockRestore();
      mergeSpy.mockRestore();
      pushSpy.mockRestore();
    });

    test('should exit with code 1 if creating tag fails', async () => {
      const readFileSpy = jest.spyOn(fs, 'readFile');
      readFileSpy
        .mockImplementation((filePath: string, callback) => {
          return callback(null, mockPkg);
        });

      const checkoutSpy = jest.spyOn(gitHelpers, 'checkout');
      checkoutSpy.mockImplementation(async () => null);

      const mergeSpy = jest.spyOn(gitHelpers, 'merge');
      mergeSpy.mockImplementation(async () => null);

      const pushSpy = jest.spyOn(gitHelpers, 'push');
      pushSpy.mockImplementation(async () => null);

      const tagSpy = jest.spyOn(gitHelpers, 'tag');
      tagSpy.mockImplementation(async () => {
        throw new Error('Creating tag had an error');
      });

      await release();

      expect(exitSpy).toHaveBeenCalledWith(1);
      expect(readFileSpy).toHaveBeenCalledTimes(1);
      expect(checkoutSpy).toHaveBeenCalledTimes(2);
      expect(mergeSpy).toHaveBeenCalledTimes(2);
      expect(pushSpy).toHaveBeenCalledTimes(2);
      expect(tagSpy).toHaveBeenCalledTimes(1);

      readFileSpy.mockRestore();
      checkoutSpy.mockRestore();
      mergeSpy.mockRestore();
      pushSpy.mockRestore();
      tagSpy.mockRestore();
    });

    test('should exit with code 1 if pushing tags fails', async () => {
      const readFileSpy = jest.spyOn(fs, 'readFile');
      readFileSpy
        .mockImplementation((filePath: string, callback) => {
          return callback(null, mockPkg);
        });

      const checkoutSpy = jest.spyOn(gitHelpers, 'checkout');
      checkoutSpy.mockImplementation(async () => null);

      const mergeSpy = jest.spyOn(gitHelpers, 'merge');
      mergeSpy.mockImplementation(async () => null);

      const pushSpy = jest.spyOn(gitHelpers, 'push');
      pushSpy
        .mockImplementationOnce(async () => null)
        .mockImplementationOnce(async () => null)
        .mockImplementationOnce(async () => {
          throw new Error('Pushing tags had an error');
        });

      const tagSpy = jest.spyOn(gitHelpers, 'tag');
      tagSpy.mockImplementation(async () => null);

      await release();

      expect(exitSpy).toHaveBeenCalledWith(1);
      expect(readFileSpy).toHaveBeenCalledTimes(1);
      expect(checkoutSpy).toHaveBeenCalledTimes(2);
      expect(mergeSpy).toHaveBeenCalledTimes(2);
      expect(pushSpy).toHaveBeenCalledTimes(3);
      expect(tagSpy).toHaveBeenCalledTimes(1);

      readFileSpy.mockRestore();
      checkoutSpy.mockRestore();
      mergeSpy.mockRestore();
      pushSpy.mockRestore();
      tagSpy.mockRestore();
    });

    test('should exit with code 0 if running a release is successful', async () => {
      const readFileSpy = jest.spyOn(fs, 'readFile');
      readFileSpy
        .mockImplementation((filePath: string, callback) => {
          return callback(null, mockPkg);
        });

      const checkoutSpy = jest.spyOn(gitHelpers, 'checkout');
      checkoutSpy.mockImplementation(async () => null);

      const mergeSpy = jest.spyOn(gitHelpers, 'merge');
      mergeSpy.mockImplementation(async () => null);

      const pushSpy = jest.spyOn(gitHelpers, 'push');
      pushSpy.mockImplementation(async () => null);

      const tagSpy = jest.spyOn(gitHelpers, 'tag');
      tagSpy.mockImplementation(async () => null);

      await release();

      expect(exitSpy).toHaveBeenCalledWith(0);
      expect(readFileSpy).toHaveBeenCalledTimes(1);
      expect(checkoutSpy).toHaveBeenCalledTimes(2);
      expect(mergeSpy).toHaveBeenCalledTimes(2);
      expect(pushSpy).toHaveBeenCalledTimes(3);
      expect(tagSpy).toHaveBeenCalledTimes(1);

      readFileSpy.mockRestore();
      checkoutSpy.mockRestore();
      mergeSpy.mockRestore();
      pushSpy.mockRestore();
      tagSpy.mockRestore();
    });
  });
});
