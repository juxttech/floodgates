#!/usr/bin/env node

import yargs from 'yargs';
import * as pkg from '../package.json';

import create from './create';
import prepare from './prepare';
import release from './release';

const VERSION = pkg.version;

yargs
  .usage('Usage: $0 [<args>] [<options>]')
  .scriptName('floodgates')
  .command('create', 'create a develop branch', {}, create)
  .command('prepare', 'create release branch, update package and changelog', {}, prepare)
  .command('release', 'merge release branch and push release tag to Git', {}, release)
  .option('M', {
    alias: 'major',
    desc: 'Prepare a major release (x.0.0)',
    type: 'boolean',
  })
  .option('m', {
    alias: 'minor',
    desc: 'Prepare a minor release (0.x.0)',
    type: 'boolean',
  })
  .option('p', {
    alias: 'patch',
    desc: 'Prepare a patch release (0.0.x)',
    type: 'boolean',
  })
  .demandCommand()
  .help('h')
  .alias('h', 'help')
  .version('v', 'Show version number', VERSION)
  .alias('v', 'version')
  .argv;
