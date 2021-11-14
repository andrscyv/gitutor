import { prompt, registerPrompt } from 'inquirer';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import inquirerCommandPrompt from 'inquirer-command-prompt';

console.log(inquirerCommandPrompt);
registerPrompt('command', inquirerCommandPrompt);

function runPrompt(): any {
  const availableCommands = [
    {
      filter: function (str: string) {
        return str.replace(/ \[.*$/, '');
      }
    },
    'foo a',
    'foo b',
    'foo ba mike',
    'foo bb buck',
    'foo bb jick',
    'boo',
    'fuu',
    'quit',
    'show john [first option]',
    'show mike [second option]',
    'isb -b --aab-long -a optA',
    'isb -b --aab-long -a optB',
    'isb -b --aab-long -a optC'
  ];

  return prompt([
    {
      type: 'command',
      name: 'cmd',
      autoCompletion: availableCommands,
      message: '>',
      context: 0,
      validate: (val: any) => {
        return val ? true : 'Press TAB for suggestions';
      },
      short: true
    }
  ])
    .then((answers: { cmd: string }) => {
      if (!~'foo,boo,doo,quit,show'.split(',').indexOf(answers.cmd)) {
        console.log('Okedoke.');
      }
      if (answers.cmd !== 'quit') {
        return runPrompt();
      }
    })
    .catch((err: { stack: any }) => {
      console.error(err.stack);
    });
}

runPrompt();
