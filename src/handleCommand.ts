import { CommandLineOptions } from 'command-line-args';

import fs from 'fs';
import os from 'os';
import path from 'path';
import readline from 'readline';

import * as pkg from '../package.json';

import { generateHelp } from './cli';

export const configPath = path.join(os.homedir(), '.floodgates');

export const getConfig = async (): Promise<object | Error> => {
  return await new Promise((resolve, reject) => {
    fs.readFile(configPath, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

export const handleInput = async (question: string):Promise<any> => {
  const input = await new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(`${question}: `, (answer: string) => {
      rl.close();
      resolve(answer);
    });
  });

  return input;
};

const handleCommand = async (command: string, options: CommandLineOptions): Promise<number> => {
  console.log(options);
  switch (command) {
    case 'help':
      console.info(generateHelp());
      return 0;
    case 'version':
      console.info(`You are Using Floodgates Version ${pkg.version}`);
      return 0;
    case 'configure':
      console.info('Welcome to Floodgates! We\'ll be helping you generate a global configuration');
      console.info('To start things off we\'re going to set up Github to create new releases\n\n');
      const githubToken = await handleInput('Github Personal Access Token');
      const json = JSON.stringify({ githubToken });
      const code = await new Promise((resolve) => {
        fs.writeFile(configPath, json, 'utf8', (err) => {
          if (err) {
            throw err;
          }
          resolve();
        });
      })
      .then(
        () => {
          console.info(`\n\nConfiguration File Written Successfully to ${configPath}`);
          return 0;
        },
        (err: Error) => {
          console.error('There was an error saving your configuration');
          console.error(err.message);
          return 2;
        },
      );
      return code;
    case 'prepare':
      return 0;
    case 'release':
      const config = await getConfig()
        .then(
          config => config,
          (err: Error) => {
            console.error(err.message);
            return false;
          },
        );
      if (!config) {
        return 3;
      }
      return 0;
    default:
      console.error(`Unsupported Command "${command ? command : ''}"`);
      console.info(generateHelp());
      return 1;
  }
};

export default handleCommand;
