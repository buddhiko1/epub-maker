import fs from "fs";
import Handlebars from "handlebars";
import archiver from "archiver";

import { BaseFactory } from "../public/factory";
import { GLOBAL_CONF } from "../config";
import { TocFactory } from "./toc";
import { sortFiles, isChapterFile } from "./utils";

export class Factory extends BaseFactory {
  async make(): Promise<void> {
    this._makeFonts();
    this._copyImages();
    this._copyTexts();
    this._makeCoverXhtml();
    this._makeTitlePage();
    this._makeRightPage();
    const tocFatory = new TocFactory(this._bookConf);
    tocFatory.make();
    this._makeOpf();
    this._copyMimetype();
    this._makeContainerXml();
    await this._archive();
  }

  private _makeFonts(): void {
    const fontFamily = this._bookConf.css.fontFamily;
    if (fontFamily) {
      fs.cpSync(this._srcPath.fontDir, this._outputPath.fontDir, {
        recursive: true,
      });
    } else {
      fs.copyFileSync(this._srcPath.defaultFont, this._outputPath.defaultFont);
    }
  }

  private _copyImages(): void {
    if (fs.existsSync(this._srcPath.imageDir)) {
      fs.cpSync(this._srcPath.imageDir, this._outputPath.imageDir, {
        recursive: true,
      });
    }
  }

  private _copyTexts(): void {
    fs.cpSync(this._srcPath.textDir, this._outputPath.textDir, {
      recursive: true,
    });
  }

  private _makeCoverXhtml(): void {
    if (!fs.existsSync(this._outputPath.coverXhtml)) {
      const contents = fs.readFileSync(
        `${__dirname}/cover.xhtml.template`,
        "utf8"
      );
      const template = Handlebars.compile(contents);
      const data = {
        coverHref: this._outputPath.coverHref,
      };
      const resultString = template(data);
      fs.writeFileSync(this._outputPath.coverXhtml, resultString, "utf-8");
    }
  }

  private _makeTitlePage(): void {
    if (!fs.existsSync(this._outputPath.titleXhtml)) {
      const contents = fs.readFileSync(`${__dirname}/title.template`, "utf8");
      const template = Handlebars.compile(contents);
      const data = {
        language: this._bookConf.metadata.language,
        styleHref: this._outputPath.textStyleHref,
      };
      const resultString = template(data);
      fs.writeFileSync(this._outputPath.titleXhtml, resultString, "utf-8");
    }
  }

  private _makeRightPage(): void {
    if (!fs.existsSync(this._outputPath.rightXhtml)) {
      const contents = fs.readFileSync(`${__dirname}/right.template`, "utf8");
      const template = Handlebars.compile(contents);
      const data = {
        language: this._bookConf.metadata.language,
        styleHref: this._outputPath.textStyleHref,
      };
      const resultString = template(data);
      fs.writeFileSync(this._outputPath.rightXhtml, resultString, "utf-8");
    }
  }

  private _makeOpf(): void {
    const contents = fs.readFileSync(
      `${__dirname}/content.opf.template`,
      "utf8"
    );
    const template = Handlebars.compile(contents);
    const textFiles = fs.readdirSync(this._outputPath.textDir);
    let charpterFiles = textFiles.filter((file) => {
      return isChapterFile(file);
    });
    charpterFiles = sortFiles(charpterFiles);
    let sortedTextFiles = [
      GLOBAL_CONF.coverXhtml,
      GLOBAL_CONF.titleXhtml,
      GLOBAL_CONF.rightXhtml,
      GLOBAL_CONF.tocXhtml,
    ];
    sortedTextFiles = sortedTextFiles.concat(charpterFiles);
    const imageFiles = fs.existsSync(this._outputPath.imageDir);
    const data = {
      metadata: this._bookConf.metadata,
      sortedTextFiles: sortedTextFiles,
      imageFiles: imageFiles,
      imageType: this._bookConf.imageType,
    };
    const resultString = template(data);
    fs.writeFileSync(this._outputPath.opf, resultString, "utf-8");
  }

  private _copyMimetype(): void {
    fs.copyFileSync(
      `${__dirname}/mimetype`,
      `${this._outputPath.bookDir}/mimetype`
    );
  }

  private _makeContainerXml(): void {
    const contents = fs.readFileSync(
      `${__dirname}/container.xml.template`,
      "utf8"
    );
    const template = Handlebars.compile(contents);
    const data = {
      opf: GLOBAL_CONF.opf,
      epubRootDir: GLOBAL_CONF.epubRootDir,
    };
    const resultString = template(data);
    fs.writeFileSync(
      `${this._outputPath.containerDir}/container.xml`,
      resultString,
      "utf-8"
    );
  }

  private async _archive(): Promise<void> {
    const archive = archiver("zip", { zlib: { level: 9 } });
    const outFile = `${this._outputPath.outputDir}/${this._bookConf.name}.epub`;
    const stream = fs.createWriteStream(outFile);
    archive
      .directory(this._outputPath.bookDir, false)
      .pipe(stream)
      .on("finish", () => {
        console.log(`make ${outFile} successfully!`);
      })
      .on("error", (error) => {
        console.error(`make ${outFile} failed: ${error}!`);
      });
    return archive.finalize();
  }
}
