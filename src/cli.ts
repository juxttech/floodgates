import commandLineArgs, { CommandLineOptions } from 'command-line-args';
import commandLineUsage from 'command-line-usage';

import handleCommand from './handleCommand';

export const generateHelp = (): string => (
  commandLineUsage([
    {
      content: [
        'CLI to Help Manage Git Flow and NPM Releases',
        'Usage: `floodgates <command> [options ...]',
      ],
      header: 'Floodgates',
    },
    {
      content: [
        {
          colA: 'help',
          colB: 'Show this message and exit',
        },
        {
          colA: 'prepare',
          colB: 'Create and Prepare a Release Branch',
        },
        {
          colA: 'release',
          colB: 'Run a release',
        },
      ],
      header: 'Available Commands',
    },
    {
      content: [
        {
          colA: '--major',
          colB: 'Release a major version (0.1.0 => 1.0.0)',
        },
        {
          colA: '--minor',
          colB: 'Release a minor version (0.1.1 => 0.2.0)',
        },
        {
          colA: '--patch',
          colB: 'Release a patch version (0.1.1 => 0.1.2)',
        },
      ],
      header: 'Global Options',
    },
  ])
);

const cli = async (options: CommandLineOptions): Promise<number> => {
  const commandDefinitions = [
    { name: 'major', type: Boolean },
    { name: 'minor', type: Boolean },
    { name: 'patch', type: Boolean },
  ];
  const commandOptions = commandLineArgs(commandDefinitions, { argv: options._unknown || [] });

  const code = await handleCommand(options.command, commandOptions);

  // Success / Fail
  return code;
};

export default cli;
