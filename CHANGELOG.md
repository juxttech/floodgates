# Changelog

## [0.2.2] - 2018-11-4

### Changed

- Package.json updated so lib is included in a packed npm package

## [0.2.1] - 2018-11-3

### Changed

- Changed the way the push function works to support branches that don't exist on the origin repository
- Changed the checkout command to specify that this is not a release branch

## [0.2.0] - 2018-11-3

### Added

- Added a command to create a develop branch

### Changed

- Fixed the wrong date showing up on changelogs
- Forced prepare command to only allow execution on develop branch
- Forced release command to only allow execution on a valid release branch

## [0.1.2] - 2018-9-2

### Changed

- Fixed creating tags not working as intended

## [0.1.1] - 2018-9-2

### Added

- A commit message with the release number is added for tagging releases

### Changed

- Fixed how tags are listed - we were accidentally only grabbing the popped value rather than popping the array

### Removed

- Removed @juxttech from package

## [0.1.0] - 2018-9-2

Initial Release
