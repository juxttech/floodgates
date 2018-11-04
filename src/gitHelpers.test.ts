import gitHelpers from './gitHelpers';

import * as childProcess from 'promisify-child-process';

describe('gitHelpers.ts', () => {
  describe('default', () => {
    describe('checkout', () => {
      test('should return stdout from command if command successful', async () => {
        const execSpy = jest.spyOn(childProcess, 'exec');
        execSpy.mockImplementation(async () => {
          return { stdout: 'bar' };
        });

        const checkoutData = await gitHelpers.checkout('foo')
          .then(res => res)
          .catch(err => err.message);

        expect(checkoutData).toEqual('bar');

        execSpy.mockRestore();
      });

      test('should return error from command if command fails', async () => {
        const execSpy = jest.spyOn(childProcess, 'exec');
        execSpy.mockImplementation(async () => {
          throw new Error('Command failed');
        });

        const checkoutData = await gitHelpers.checkout('foo', false)
          .then(res => res)
          .catch(err => err.message);

        expect(checkoutData).toEqual('Command failed');

        execSpy.mockRestore();
      });
    });

    describe('getAllTags', () => {
      test('should return stdout from command if command successful', async () => {
        const execSpy = jest.spyOn(childProcess, 'exec');
        execSpy.mockImplementation(async () => {
          return { stdout: 'foo\nbar' };
        });

        const allTagsData = await gitHelpers.getAllTags()
          .then(res => res)
          .catch(err => err.message);

        expect(allTagsData[0]).toEqual('foo');

        execSpy.mockRestore();
      });

      test('should return error from command if command fails', async () => {
        const execSpy = jest.spyOn(childProcess, 'exec');
        execSpy.mockImplementation(async () => {
          throw new Error('Command failed');
        });

        const allTagsData = await gitHelpers.getAllTags()
          .then(res => res)
          .catch(err => err.message);

        expect(allTagsData).toEqual('Command failed');

        execSpy.mockRestore();
      });
    });

    describe('getCurrentBranch', () => {
      test('should return stdout from command if command successful', async () => {
        const execSpy = jest.spyOn(childProcess, 'exec');
        execSpy.mockImplementation(async () => {
          return { stdout: 'foo\n' };
        });

        const currentbranchData = await gitHelpers.getCurrentBranch()
          .then(res => res)
          .catch(err => err.message);

        expect(currentbranchData).toEqual('foo');

        execSpy.mockRestore();
      });

      test('should return error from command if command fails', async () => {
        const execSpy = jest.spyOn(childProcess, 'exec');
        execSpy.mockImplementation(async () => {
          throw new Error('Command failed');
        });

        const allTagsData = await gitHelpers.getCurrentBranch()
          .then(res => res)
          .catch(err => err.message);

        expect(allTagsData).toEqual('Command failed');

        execSpy.mockRestore();
      });
    });

    describe('merge', () => {
      test('should return stdout from command if command successful', async () => {
        const execSpy = jest.spyOn(childProcess, 'exec');
        execSpy.mockImplementation(async () => {
          return { stdout: 'bar' };
        });

        const mergeData = await gitHelpers.merge('')
          .then(res => res)
          .catch(err => err.message);

        expect(mergeData).toEqual('bar');

        execSpy.mockRestore();
      });

      test('should return error from command if command fails', async () => {
        const execSpy = jest.spyOn(childProcess, 'exec');
        execSpy.mockImplementation(async () => {
          throw new Error('Command failed');
        });

        const mergeData = await gitHelpers.merge('')
          .then(res => res)
          .catch(err => err.message);

        expect(mergeData).toEqual('Command failed');

        execSpy.mockRestore();
      });
    });

    describe('push', () => {
      test('should return stdout from command if command successful', async () => {
        const execSpy = jest.spyOn(childProcess, 'exec');
        execSpy.mockImplementation(async () => {
          return { stdout: 'bar' };
        });

        const pushData = await gitHelpers.push()
          .then(res => res)
          .catch(err => err.message);

        expect(pushData).toEqual('bar');

        execSpy.mockRestore();
      });

      test('should return error from command if command fails', async () => {
        const execSpy = jest.spyOn(childProcess, 'exec');
        execSpy.mockImplementation(async () => {
          throw new Error('Command failed');
        });

        const pushData = await gitHelpers.push(true)
          .then(res => res)
          .catch(err => err.message);

        expect(pushData).toEqual('Command failed');

        execSpy.mockRestore();
      });
    });

    describe('tag', () => {
      test('should return stdout from command if command successful', async () => {
        const execSpy = jest.spyOn(childProcess, 'exec');
        execSpy.mockImplementation(async () => {
          return { stdout: 'bar' };
        });

        const tagData = await gitHelpers.tag('foo')
          .then(res => res)
          .catch(err => err.message);

        expect(tagData).toEqual('bar');

        execSpy.mockRestore();
      });

      test('should return error from command if command fails', async () => {
        const execSpy = jest.spyOn(childProcess, 'exec');
        execSpy.mockImplementation(async () => {
          throw new Error('Command failed');
        });

        const tagData = await gitHelpers.tag('foo')
          .then(res => res)
          .catch(err => err.message);

        expect(tagData).toEqual('Command failed');

        execSpy.mockRestore();
      });
    });
  });
});
