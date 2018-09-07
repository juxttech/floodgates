import commandLineArgs, { OptionDefinition } from 'command-line-args';
import cli from './cli';

const mainDefinitions: OptionDefinition[] = [{
  defaultOption: true,
  name: 'command',
}];

const options = commandLineArgs(mainDefinitions, { stopAtFirstUnknown: true });

cli(options)
.then((code: number) => process.exit(code));
