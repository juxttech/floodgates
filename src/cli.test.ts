import { CommandLineOptions } from 'command-line-args';
import cli, { generateHelp } from './cli';

describe('cli.ts', () => {
  describe('default', () => {
    let consoleSpy: () => null;
    let errorSpy: () => null;
    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'info').mockImplementation(() => null);
      errorSpy = jest.spyOn(console, 'error').mockImplementation(() => null);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('should return 1 if given a command that does not exist', async () => {
      const options: CommandLineOptions = {
        command: 'foo',
      };
      const code = await cli(options);

      expect(code).toBe(1);
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledTimes(1);
    });

    test('should return 0 if "help" is called', async () => {
      const options: CommandLineOptions = {
        command: 'help',
      };
      const code = await cli(options);

      expect(code).toBe(0);
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledTimes(0);
    });

    test('should return 1 if "test" is called', async () => {
      const options: CommandLineOptions = {
        command: 'test',
      };
      const code = await cli(options);

      expect(code).toBe(1);
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('generateHelp()', () => {
    test('should return a string', () => {
      const help = generateHelp();
      expect(typeof help).toBe('string');
    });
  });
});
