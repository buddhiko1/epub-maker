import fs from "fs";
import clear from "clear";
import inquirer from "inquirer";
import { Command } from "commander";

import { GLOBAL_CONF } from "./config";
import { Factory as BookFactory } from "./book";
import { IConf as IBookConf } from "./book/interfaces";

function _getBookConf(name: string): IBookConf {
  const file = `${GLOBAL_CONF.srcDir}/${name}/config.json`;
  const rawData = fs.readFileSync(file);
  const conf = JSON.parse(rawData.toString());
  return { ...conf, ...{ name: name } };
}

const bookNames = fs.readdirSync(GLOBAL_CONF.srcDir);

async function selectBook(): Promise<string> {
  clear();
  return await inquirer
    .prompt([
      {
        type: "list",
        name: "name",
        message: "Which book?",
        choices: bookNames,
      },
    ])
    .then((answer) => {
      return answer.name ?? <never>answer;
    });
}

async function main() {
  const program = new Command();
  program
    .version("1.0.0")
    .name("ts-node")
    .usage("index.ts [options]")
    .option("-a, --all", "make epub for all books")
    .action(async (options) => {
      if (options.all) {
        for (const name of bookNames) {
          const bookConf = _getBookConf(name);
          const bookFactory = new BookFactory(bookConf);
          await bookFactory.make();
        }
      } else {
        selectBook().then(async (name) => {
          const bookConf = _getBookConf(name);
          const bookFactory = new BookFactory(bookConf);
          bookFactory.make();
        });
      }
    });
  await program.parseAsync(process.argv);
}

main();
