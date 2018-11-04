import { exec } from 'promisify-child-process';

const checkout = async (details: string, release = true) => {
  const { stdout } = await exec(`git checkout ${release ? `-b release/${details}` : details }`)
    .then(
      data => data,
      (err: Error) => {
        throw err;
      },
    )
    .catch((err: Error) => {
      throw err;
    });
  return stdout;
};

const getAllTags = async () => {
  const { stdout } = await exec(
    'git for-each-ref --sort=-taggerdate --format \'%(refname)\' refs/tags')
    .then(
      data => data,
      (err: Error) => {
        throw err;
      },
    )
    .catch((err: Error) => {
      throw err;
    });
  const tagsArray = stdout.split(/\r?\n/g);
  tagsArray.pop();
  return tagsArray;
};

const getCurrentBranch = async () => {
  const { stdout } = await exec('git branch | grep \\* | cut -d \' \' -f2')
  .then(
    data => data,
    (err: Error) => {
      throw err;
    },
  )
  .catch((err: Error) => {
    throw err;
  });
  const currentBranchArray = stdout.split(/\r?\n/g);
  currentBranchArray.pop();
  return currentBranchArray[0];
};

const merge = async (version: string) => {
  const { stdout } = await exec(`git merge --no-ff release/${version}`)
    .then(
      data => data,
      (err: Error) => {
        throw err;
      },
    )
    .catch((err: Error) => {
      throw err;
    });
  return stdout;
};

const push = async (tags = false) => {
  const { stdout } = await exec(`git push${tags ? ' --tags' : ''}`)
    .then(
      data => data,
      (err: Error) => {
        throw err;
      },
    )
    .catch((err: Error) => {
      throw err;
    });
  return stdout;
};

const tag = async (version: string) => {
  const { stdout } = await exec(`git tag -a ${version} master -m "Version ${version}"`)
    .then(
      data => data,
      (err: Error) => {
        throw err;
      },
    )
    .catch((err: Error) => {
      throw err;
    });
  return stdout;
};

export default { checkout, getAllTags, getCurrentBranch, merge, push, tag };
