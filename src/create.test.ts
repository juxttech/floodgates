import create from './create';
import gitHelpers from './gitHelpers';

describe('create.ts', () => {
  describe('default', () => {
    let exitSpy: jest.SpyInstance;
    beforeEach(() => {
      exitSpy = jest.spyOn(process, 'exit');
      exitSpy.mockImplementation((code: number) => code);
    });

    afterEach(() => {
      exitSpy.mockRestore();
    });

    test('should exit with code 1 if current branch is not "master"', async () => {
      const getCurrentBranchSpy = jest.spyOn(gitHelpers, 'getCurrentBranch');
      getCurrentBranchSpy.mockImplementation(async () => {
        throw new Error('getCurrentBranch had an error');
      });

      await create();

      expect(exitSpy).toHaveBeenCalledWith(1);

      getCurrentBranchSpy.mockRestore();
    });

    test('should exit with code 1 if checking out develop branch fails', async () => {
      const getCurrentBranchSpy = jest.spyOn(gitHelpers, 'getCurrentBranch');
      getCurrentBranchSpy.mockImplementation(async () => 'master');

      const checkoutSpy = jest.spyOn(gitHelpers, 'checkout');
      checkoutSpy.mockImplementation(async () => {
        throw new Error('checkout had an error');
      });

      await create();

      expect(exitSpy).toHaveBeenCalledWith(1);
      expect(getCurrentBranchSpy).toHaveBeenCalledTimes(1);
      expect(checkoutSpy).toHaveBeenCalledTimes(1);

      getCurrentBranchSpy.mockRestore();
      checkoutSpy.mockRestore();
    });

    test('should exit with code 1 if pushing the current branch fails', async () => {
      const getCurrentBranchSpy = jest.spyOn(gitHelpers, 'getCurrentBranch');
      getCurrentBranchSpy.mockImplementation(async () => 'master');

      const checkoutSpy = jest.spyOn(gitHelpers, 'checkout');
      checkoutSpy.mockImplementation(async () => null);

      const pushSpy = jest.spyOn(gitHelpers, 'push');
      pushSpy.mockImplementation(async () => {
        throw new Error('push had an error');
      });

      await create();

      expect(exitSpy).toHaveBeenCalledWith(1);
      expect(getCurrentBranchSpy).toHaveBeenCalledTimes(1);
      expect(checkoutSpy).toHaveBeenCalledTimes(1);
      expect(pushSpy).toHaveBeenCalledTimes(1);

      getCurrentBranchSpy.mockRestore();
      checkoutSpy.mockRestore();
      pushSpy.mockRestore();
    });

    test('should exit with code 0 if pushing the current branch succeeds', async () => {
      const getCurrentBranchSpy = jest.spyOn(gitHelpers, 'getCurrentBranch');
      getCurrentBranchSpy.mockImplementation(async () => 'master');

      const checkoutSpy = jest.spyOn(gitHelpers, 'checkout');
      checkoutSpy.mockImplementation(async () => null);

      const pushSpy = jest.spyOn(gitHelpers, 'push');
      pushSpy.mockImplementation(async () => null);

      await create();

      expect(exitSpy).toHaveBeenCalledWith(0);
      expect(getCurrentBranchSpy).toHaveBeenCalledTimes(1);
      expect(checkoutSpy).toHaveBeenCalledTimes(1);
      expect(pushSpy).toHaveBeenCalledTimes(1);

      getCurrentBranchSpy.mockRestore();
      checkoutSpy.mockRestore();
      pushSpy.mockRestore();
    });
  });
});
