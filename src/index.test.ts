describe('index.ts', () => {
  test('should exit with code 1 by default', async () => {
    const consoleSpy = jest.spyOn(console, 'info').mockImplementation(() => null);
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation((number: number) => number);

    await require('./');
    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
});
