import chalk from 'chalk';

export const error = (message: string) => console.error(chalk.red(message));
export const info = (message: string) => console.info(chalk.green(message));
