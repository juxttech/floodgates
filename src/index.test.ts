describe('index.ts', () => {
  let consoleSpy: () => null;
  let errorSpy: () => null;
  beforeAll(() => {
    consoleSpy = jest.spyOn(console, 'info').mockImplementation(() => null);
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => null);
    jest.spyOn(process, 'exit').mockImplementation((number: number) => number);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  test('should exit with code 1 by default', async () => {
    await require('./');
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });
});
