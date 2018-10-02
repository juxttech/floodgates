import { noChangelog, partialChangelog } from './changelog';

describe('changelog.ts', () => {
  describe('noChangelog', () => {
    test('should return a string containing the given date and version and contain header', () => {
      const readme = noChangelog('foo', 'bar');
      expect(typeof readme).toBe('string');
      expect(readme).toContain('foo');
      expect(readme).toContain('bar');
      expect(readme).toContain('# Changelog');
    });
  });

  describe('partialChangelog', () => {
    test('should return a string containing the given date and version', () => {
      const readme = partialChangelog('foo', 'bar');
      expect(typeof readme).toBe('string');
      expect(readme).toContain('foo');
      expect(readme).toContain('bar');
    });
  });
});
