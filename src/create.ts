import path from 'path';

import gitHelpers from './gitHelpers';
import { error, info } from './utils';

export const pkgPath = path.join(process.cwd(), 'package.json');

const release = async () => {
  const currentBranch = await gitHelpers.getCurrentBranch()
    .then(
      res => res,
      (err: Error) => {
        throw err;
      },
    )
    .catch((err: Error) => {
      error('An unexpected error has occurred while fetching your repository\'s current branch');
      error(err.message);
      return;
    });

  if (currentBranch !== 'master') {
    error('A new project can only be set up on the master branch');
    process.exit(1);
    return;
  }

  const checkout = await gitHelpers.checkout('develop', false)
    .then(
      () => null,
      (err) => {
        throw err;
      },
    )
    .catch((err: Error) => {
      error('An unexpected error occurred while checking out a develop branch');
      error(err.message);
      return;
    });

  if (checkout === undefined) {
    process.exit(1);
    return;
  }

  await gitHelpers.push(false, true)
    .then(
      () => {
        info('New Project Successfully Set Up');
        process.exit(0);
        return;
      },
      (err: Error) => {
        throw err;
      },
    )
    .catch((err: Error) => {
      error('An unexpected error has occurred while pushing your develop branch');
      error(err.message);
      process.exit(1);
      return;
    });
};

export default release;
