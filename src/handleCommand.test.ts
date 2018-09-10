import fs from 'fs';
import readline from 'readline';

import handleCommand, { configPath } from './handleCommand';

describe('handleCommand.ts', () => {
  describe('default', () => {
    let consoleSpy: () => null;
    let errorSpy: () => null;
    const returnedQuestion: string[] = [];

    beforeEach(() => {
      jest.spyOn(readline, 'createInterface')
        .mockImplementation(() => ({
          close: () => null,
          question: (question: string, callback: (answer: string) => void) => {
            returnedQuestion.push(question);
            return callback('Foobar');
          },
        }));
      consoleSpy = jest.spyOn(console, 'info').mockImplementation(() => null);
      errorSpy = jest.spyOn(console, 'error').mockImplementation(() => null);
    });

    afterEach(() => {
      returnedQuestion.length = 0;
      jest.clearAllMocks();
    });

    test('should return 1 on an unsupported command', async () => {
      const code = await handleCommand('test', {});
      expect(code).toBe(1);
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledTimes(1);
    });

    test('should return 0 on "help"', async () => {
      const code = await handleCommand('help', {});
      expect(code).toBe(0);
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledTimes(0);
    });

    test('should return 0 on "version"', async () => {
      const code = await handleCommand('version', {});
      expect(code).toBe(0);
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledTimes(0);
    });

    test('should return 0 on "configure" when successful', async () => {
      let returnedPath = '';
      let returnedContents = '';
      let returnedOptions = '';
      jest.spyOn(fs, 'writeFile')
        .mockImplementation((path: string, contents: string, options: string, callback) => {
          returnedPath = path;
          returnedContents = contents;
          returnedOptions = options;
          return callback();
        });

      const code = await handleCommand('configure', {});
      expect(code).toBe(0);
      expect(consoleSpy).toHaveBeenCalledTimes(3);
      expect(errorSpy).toHaveBeenCalledTimes(0);
      expect(returnedQuestion[0]).toBe('Github Personal Access Token: ');
      expect(returnedPath).toBe(configPath);
      expect(JSON.parse(returnedContents).githubToken).toBe('Foobar');
      expect(returnedOptions).toBe('utf8');
    });

    test('should return 2 on "configure" when unsuccessful', async () => {
      let returnedPath = '';
      let returnedContents = '';
      let returnedOptions = '';
      jest.spyOn(fs, 'writeFile')
        .mockImplementation((path: string, contents: string, options: string, callback) => {
          returnedPath = path;
          returnedContents = contents;
          returnedOptions = options;
          return callback(new Error('Something went wrong'));
        });

      const code = await handleCommand('configure', {});
      expect(code).toBe(2);
      expect(consoleSpy).toHaveBeenCalledTimes(2);
      expect(errorSpy).toHaveBeenCalledTimes(2);
      expect(returnedQuestion[0]).toBe('Github Personal Access Token: ');
      expect(returnedPath).toBe(configPath);
      expect(JSON.parse(returnedContents).githubToken).toBe('Foobar');
      expect(returnedOptions).toBe('utf8');
    });

    test('should return 0 on "prepare"', async () => {
      const code = await handleCommand('prepare', {});
      expect(consoleSpy).toHaveBeenCalledTimes(0);
      expect(errorSpy).toHaveBeenCalledTimes(0);
      expect(code).toBe(0);
    });

    test('should return 0 on "release" when successful', async () => {
      let returnedPath = '';
      jest.spyOn(fs, 'readFile')
        .mockImplementation((path: string, callback) => {
          returnedPath = path;
          return callback(null, JSON.stringify({ foo: 'bar' }));
        });
      const code = await handleCommand('release', {});
      expect(code).toBe(0);
      expect(consoleSpy).toHaveBeenCalledTimes(0);
      expect(errorSpy).toHaveBeenCalledTimes(0);
      expect(returnedPath).toBe(configPath);
    });

    test('should return 3 on "release" when configuration is not found', async () => {
      let returnedPath = '';
      jest.spyOn(fs, 'readFile')
        .mockImplementation((path: string, callback) => {
          returnedPath = path;
          return callback(new Error('Something bad happened'));
        });
      const code = await handleCommand('release', {});
      expect(code).toBe(3);
      expect(consoleSpy).toHaveBeenCalledTimes(0);
      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(returnedPath).toBe(configPath);
    });
  });
});
