import fs from 'fs';
import path from 'path';
import util from 'util';

import semver from 'semver';

import { noChangelog, partialChangelog } from './changelog';
import gitHelpers from './gitHelpers';
import { error, info } from './utils';

export const changelogPath = path.join(process.cwd(), 'CHANGELOG.md');
export const pkgPath = path.join(process.cwd(), 'package.json');

const prepare = async (options: any) => {
  const { major, minor, patch } = options;
  if (!major && !minor && !patch) {
    error('You need to specify what type of release you\'re doing before we can prepare');
    process.exit(1);
    return;
  }

  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`;

  // Get the project's package.json and get its version
  const pkg = await util.promisify(fs.readFile)(pkgPath)
    .then(
      file => JSON.parse(file.toString()),
      (err: Error) => {
        throw err;
      },
    )
    .catch((err: Error) => {
      error('An unexpected error has occurred while reading your project\'s package.json');
      error(err.message);
      return;
    });

  // Have to throw like this for tests
  if (pkg === undefined) {
    process.exit(1);
    return;
  }

  let version = pkg.version;

  // Get all tags from the project's Git repo
  const allTags = await gitHelpers.getAllTags()
    .then(
      tags => tags,
      (err: Error) => {
        throw err;
      },
    )
    .catch((err: Error) => {
      error('An unexpected error has occurred while getting your repository\'s tag list');
      error(err.message);
      process.exit(1);
      return;
    });

  if (allTags === undefined) {
    process.exit(1);
    return;
  }

  // Override whatever the package.json says if Git returns tags
  if (allTags.length > 0) {
    let tempVersion = allTags[0].split('refs/tags/')[1];
    // We only care about command options if it's not an initial release
    if (major) {
      tempVersion = semver.inc(tempVersion, 'major') || tempVersion;
    }
    if (minor) {
      tempVersion = semver.inc(tempVersion, 'minor') || tempVersion;
    }
    if (patch) {
      tempVersion = semver.inc(tempVersion, 'patch') || tempVersion;
    }
    version = tempVersion;
  }

  // Checkout a release branch
  const checkout = await gitHelpers.checkout(version)
    .then(
      () => null,
      (err) => {
        throw err;
      },
    )
    .catch((err: Error) => {
      error('An unexpected error occurred while checking out a release branch');
      error(err.message);
      return;
    });

  if (checkout === undefined) {
    process.exit(1);
    return;
  }

  // Check if a changelog exists, a simple true or false will usually do
  const changelogExists = await util.promisify(fs.access)(changelogPath, fs.constants.F_OK)
    .then(
      () => true,
      () => false,
    );

  let changelogText = '';

  // If so, add the changelog template to line 2
  if (changelogExists) {
    const changelog = await util.promisify(fs.readFile)(changelogPath)
      .then(
        contents => contents.toString().split('\n'),
      )
      .catch((err: Error) => {
        error('An unexpected error occurred while reading your changelog');
        error(err.message);
        return;
      });

    if (changelog === undefined) {
      process.exit(1);
      return;
    }

    changelog.splice(1, 0, partialChangelog(version, formattedDate));
    changelogText = changelog.join('\n');
  } else {
    // If not, create a file and populate it with a template
    changelogText = noChangelog(version, formattedDate);
  }

  // Write the changelog
  const changelog = await util.promisify(fs.writeFile)(changelogPath, changelogText, 'utf8')
    .then(
      () => null,
      (err: Error) => {
        throw err;
      },
    )
    .catch((err: Error) => {
      error('An unexpected error occurred while saving your changelog');
      error(err.message);
      return;
    });

  if (changelog === undefined) {
    process.exit(1);
    return;
  }

  // Write the updated package.json and quit
  pkg.version = version;
  await util.promisify(fs.writeFile)(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8')
    .then(
      () => {
        info('Your repository has been successfully prepared for release');
        process.exit(0);
      },
      (err: Error) => {
        throw err;
      },
    )
    .catch((err: Error) => {
      error('An unexpected error occurred while saving your package.json');
      error(err.message);
      return process.exit(1);
    });
};

export default prepare;
