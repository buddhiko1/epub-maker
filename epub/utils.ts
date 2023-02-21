import fs from "fs";

function _getFileOrder(file: string): number {
  const regex = /(?<order>\d+)-.*\.xhtml/g;
  for (const match of file.matchAll(regex)) {
    if (match.groups) {
      return Number(match.groups.order);
    }
  }
  throw Error(`Invalide file name: ${file}!`);
}

export function sortFiles(files: string[]) {
  files.sort((file1, file2) => {
    const file1Order = _getFileOrder(file1);
    const file2Order = _getFileOrder(file2);
    return file1Order - file2Order;
  });
  return files;
}

export function isChapterFile(file: string): boolean {
  const regex = /\d+-.*\.xhtml/g;
  const matched = file.match(regex);
  return Boolean(matched);
}

export function getAllFiles(path: string): string[] {
  const files = [];
  for (const file of fs.readdirSync(path)) {
    const fullPath = path + "/" + file;
    if (fs.lstatSync(fullPath).isDirectory())
      getAllFiles(fullPath).forEach((x) => files.push(file + "/" + x));
    else files.push(file);
  }
  return files;
}
