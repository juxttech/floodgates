
export const noChangelog = (version: string, date: string) => `# Changelog

## [${version}] - ${date}

### Added

- Something added

### Changed

- Something changed

### Removed

- Something removed
`;

export const partialChangelog = (version: string, date: string) => `
## [${version}] - ${date}

### Added

- Something added

### Changed

- Something changed

### Removed

- Something removed`;
