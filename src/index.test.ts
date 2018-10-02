import yargs from 'yargs';

describe('index.ts', () => {
  test('should call each function in the yargs chain', () => {
    // Prepare Test (Set up Spies and Mocks)
    let finishedChain = false;
    const finishChain = () => {
      finishedChain = true;
      return;
    };

    // Mock each command in the chain that we use so they don't do anything
    const mockYargs = {
      alias: () => mockYargs,
      argv: finishChain(), // When we hit this the chain finishes
      command: () => mockYargs,
      demandCommand: () => mockYargs,
      help: () => mockYargs,
      option: () => mockYargs,
      scriptName: () => mockYargs,
      version: () => mockYargs,
    };

    // Mock usage since we start there
    const usageSpy = jest.spyOn(yargs, 'usage');
    usageSpy.mockImplementation(() => mockYargs);

    // Run test
    require('./');

    // Check output
    // Make sure our initial "yargs" was called and the chain finishes
    expect(usageSpy).toHaveBeenCalledTimes(1);
    expect(finishedChain).toEqual(true);

    // Restore spies
    usageSpy.mockRestore();
  });
});
