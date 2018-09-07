import { CommandLineOptions } from 'command-line-args';

const handleCommand = async (command: string, options: CommandLineOptions): Promise<number> => {
  switch (command) {
    case 'prepare':
      console.log(options);
      return 0;
    default:
      return 1;
  }
};

export default handleCommand;
