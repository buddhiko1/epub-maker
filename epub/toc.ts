import fs from "fs";
import Handlebars from "handlebars";

import { GLOBAL_CONF } from "../config";
import { BaseFactory } from "../public/factory";

import { IChapter, ISubChapter } from "./interfaces";
import { sortFiles, isChapterFile } from "./utils";

export class TocFactory extends BaseFactory {
  make(): void {
    this._makeXhtml();
  }

  private _getChapters(): IChapter[] {
    const chapters: IChapter[] = [];
    const textFiles = fs.readdirSync(this._srcPath.textDir);
    let chapterFiles = textFiles.filter((file) => {
      return isChapterFile(file);
    });
    chapterFiles = sortFiles(chapterFiles);
    for (const file of chapterFiles) {
      const title = this._extractChapterTitle(file);
      const subChapters = this._extractSubChapters(file);
      chapters.push({
        title,
        file,
        subChapters,
      });
    }
    return chapters;
  }

  private _extractChapterTitle(file: string): string {
    const filePath = `${this._outputPath.textDir}/${file}`;
    const content = fs.readFileSync(filePath, "utf8");
    const regexp = /<h2[^>]*>(?<title>.*)<\/h2>/g;
    for (const match of content.matchAll(regexp)) {
      if (match?.groups) {
        return match.groups.title;
      }
    }
    throw Error(`Can't extract chapter title in the ${file}!`);
  }

  private _extractSubChapters(file: string): ISubChapter[] {
    const subChapters: ISubChapter[] = [];
    const filePath = `${this._outputPath.textDir}/${file}`;
    const content = fs.readFileSync(filePath, "utf8");
    const regexp = /<h3 id="(?<id>[^>]*)">(?<title>.*)<\/h3>/g;
    for (const match of content.matchAll(regexp)) {
      if (match?.groups) {
        subChapters.push({
          id: match.groups.id,
          title: match.groups.title,
        });
      }
    }
    return subChapters;
  }

  private _makeXhtml(): void {
    const chapters = this._getChapters();
    const contents = fs.readFileSync(`${__dirname}/toc.xhtml.template`, "utf8");
    const fileTemplate = Handlebars.compile(contents);
    const data = {
      language: this._bookConf.metadata.language,
      styleHref: this._outputPath.tocStyleHref,
      titleXhtml: `${GLOBAL_CONF.titleXhtml}`,
      rightXhtml: `${GLOBAL_CONF.rightXhtml}`,
      chapters: chapters,
    };
    const resultString = fileTemplate(data);
    fs.writeFileSync(this._outputPath.tocXhtml, resultString, "utf-8");
  }
}
