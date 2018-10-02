import fs from 'fs';
import path from 'path';
import util from 'util';

import gitHelpers from './gitHelpers';
import { error, info } from './utils';

export const pkgPath = path.join(process.cwd(), 'package.json');

const release = async () => {
  const pkgVersion = await util.promisify(fs.readFile)(pkgPath)
    .then(
      (res: Buffer) => JSON.parse(res.toString()).version,
      (err: Error) => {
        throw err;
      },
    )
    .catch((err: Error) => {
      error('An unexpected error has occurred while reading your project\'s package.json');
      error(err.message);
      return;
    });

  if (pkgVersion === undefined) {
    process.exit(1);
    return;
  }

  // Deal with develop, then master
  const develop = await gitHelpers.checkout('develop', false)
    .then(
      () => null,
      (err: Error) => {
        throw err;
      },
    )
    .catch((err: Error) => {
      error('An unexpected error has occurred while checking out your develop branch');
      error(err.message);
      return;
    });

  if (develop === undefined) {
    process.exit(1);
    return;
  }

  const mergeDevelop = await gitHelpers.merge(pkgVersion)
    .then(
      () => null,
      (err: Error) => {
        throw err;
      },
    )
    .catch((err: Error) => {
      error('An unexpected error has occurred while merging your release with develop');
      error(err.message);
      return;
    });

  if (mergeDevelop === undefined) {
    process.exit(1);
    return;
  }

  const pushDevelop = await gitHelpers.push()
    .then(
      () => null,
      (err: Error) => {
        throw err;
      },
    )
    .catch((err: Error) => {
      error('An unexpected error has occurred while pushing your develop branch');
      error(err.message);
      return;
    });

  if (pushDevelop === undefined) {
    process.exit(1);
    return;
  }

  const master = await gitHelpers.checkout('master', false)
    .then(
      () => null,
      (err: Error) => {
        throw err;
      },
    )
    .catch((err: Error) => {
      error('An unexpected error has occurred while checking out your master branch');
      error(err.message);
      return;
    });

  if (master === undefined) {
    process.exit(1);
    return;
  }

  const mergeMaster = await gitHelpers.merge(pkgVersion)
    .then(
      () => null,
      (err: Error) => {
        throw err;
      },
    )
    .catch((err: Error) => {
      error('An unexpected error has occurred while merging your release with master');
      error(err.message);
      return;
    });

  if (mergeMaster === undefined) {
    process.exit(1);
    return;
  }

  const pushMaster = await gitHelpers.push()
    .then(
      () => null,
      (err: Error) => {
        throw err;
      },
    )
    .catch((err: Error) => {
      error('An unexpected error has occurred while pushing your master branch');
      error(err.message);
      return;
    });

  if (pushMaster === undefined) {
    process.exit(1);
    return;
  }

  const tagRelease = await gitHelpers.tag(pkgVersion)
    .then(
      () => null,
      (err: Error) => {
        throw err;
      },
    )
    .catch((err: Error) => {
      error('An unexpected error has occurred while tagging your release');
      error(err.message);
      return;
    });

  if (tagRelease === undefined) {
    process.exit(1);
    return;
  }

  // Push the tags
  await gitHelpers.push(true)
    .then(
      () => {
        info('Release has completed successfully');
        process.exit(0);
        return;
      },
      (err: Error) => {
        throw err;
      },
    )
    .catch((err: Error) => {
      error('An unexpected error has occurred while pushing your release tag');
      error(err.message);
      process.exit(1);
      return;
    });

};

export default release;
