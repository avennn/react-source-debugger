import chalk from 'chalk';

const hint = {
  doing(...args) {
    console.log(chalk.cyan(...args), '\n');
  },
  success(...args) {
    console.log(chalk.green(...args), '\n');
  },
  warn(...args) {
    console.log(chalk.yellow(...args), '\n');
  },
  error(...args) {
    console.log(chalk.red(...args), '\n');
  },
};

export default hint;
