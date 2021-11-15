export async function callIfFunction(
  // eslint-disable-next-line @typescript-eslint/ban-types
  valOrFunc: Function | any,
  ...args: any[]
): Promise<any> {
  if (typeof valOrFunc === 'function') {
    return await Promise.resolve(valOrFunc(...args));
  }
  return valOrFunc;
}

export function buildFileAutocompletion(
  baseCommand: string,
  files: string[]
): (partialInput: string) => string[] {
  return (partialInput: string): string[] => {
    baseCommand.trim();
    partialInput.trim();
    // if user has not typed base command, suggest it
    if (!partialInput.startsWith(baseCommand)) {
      return [baseCommand];
    }

    const selectAllFilesCommand = `${baseCommand} .`;
    // if user selects all files dont suggest more files
    if (partialInput === selectAllFilesCommand) {
      return [];
    }

    // if user has typed base command, suggest files that
    // are not already in the args
    const args = partialInput.split(' ').slice(baseCommand.split(' ').length);

    // If last command is partially typed, remove last arg since it
    // polutes suggestions
    const lastArgIsPartiallyTyped = !files.includes(args[args.length - 1]);
    if (lastArgIsPartiallyTyped) {
      args.pop();
    }

    return [selectAllFilesCommand].concat(
      files
        .filter((file) => !args.includes(file))
        .map(
          (file) =>
            `${
              baseCommand + (args.length > 0 ? ' ' + args.join(' ') : '')
            } ${file}`
        )
    );
  };
}
