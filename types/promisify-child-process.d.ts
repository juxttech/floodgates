declare module 'promisify-child-process' {
  interface IConsoleOutput {
    stdout: string;
    stderr: string;
  }

  export const exec: (command: string) => Promise<IConsoleOutput>;
}