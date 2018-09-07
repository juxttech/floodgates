import handleCommand from './handleCommand';

describe('handleCommand.ts', () => {
  describe('default', () => {
    test('should return 1 on an unsupported command', async () => {
      const code = await handleCommand('test', []);
      expect(code).toBe(1);
    });
    test('should return 0 on "prepare"', async () => {
      const code = await handleCommand('prepare', []);
      expect(code).toBe(0);
    });
  });
});
