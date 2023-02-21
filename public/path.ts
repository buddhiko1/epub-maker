import path from "path";

import { GLOBAL_CONF, DEFAULT_CSS } from "../config";
import { IConf as IBookConf } from "../book/interfaces";

abstract class BasePath {
  protected _coverName: string;

  constructor(protected _baseDir: string, protected _bookConf: IBookConf) {
    this._coverName = `${GLOBAL_CONF.coverPrefix}.${this._bookConf.imageType}`;
  }

  get baseDir(): string {
    return this._baseDir;
  }
  get fontDir(): string {
    return `${this._baseDir}/${GLOBAL_CONF.fontDir}`;
  }
  get textDir(): string {
    return `${this._baseDir}/${GLOBAL_CONF.textDir}`;
  }
  get imageDir(): string {
    return `${this._baseDir}/${GLOBAL_CONF.imageDir}`;
  }
  get styleDir(): string {
    return `${this._baseDir}/${GLOBAL_CONF.styleDir}`;
  }
  get textCss(): string {
    return `${this.styleDir}/${GLOBAL_CONF.textCss}`;
  }
  get tocCss(): string {
    return `${this.styleDir}/${GLOBAL_CONF.tocCss}`;
  }
  get rightXhtml(): string {
    return `${this.textDir}/${GLOBAL_CONF.rightXhtml}`;
  }
  get titleXhtml(): string {
    return `${this.textDir}/${GLOBAL_CONF.titleXhtml}`;
  }
  get coverImage(): string {
    return `${this.imageDir}/${this._coverName}`;
  }
  get bookFont(): string {
    const customFontFamily = this._bookConf.css.fontFamily;
    return `${this.fontDir}/${customFontFamily}.ttf`;
  }
}

export class SrcPath extends BasePath {
  constructor(bookConf: IBookConf) {
    const baseDir = `${GLOBAL_CONF.srcDir}/${bookConf.name}`;
    super(baseDir, bookConf);
  }
  get defaultFont(): string {
    return `${path.dirname(__dirname)}/assets/fonts/${
      DEFAULT_CSS.fontFamily
    }.ttf`;
  }
}

export class OutputPath extends BasePath {
  constructor(bookConf: IBookConf) {
    const baseDir = `${GLOBAL_CONF.outputDir}/${bookConf.name}/${GLOBAL_CONF.epubRootDir}`;
    super(baseDir, bookConf);
  }
  get bookDir(): string {
    return `${GLOBAL_CONF.outputDir}/${this._bookConf.name}`;
  }
  get outputDir(): string {
    return GLOBAL_CONF.outputDir;
  }
  get defaultFont(): string {
    return `${this.fontDir}/${DEFAULT_CSS.fontFamily}.ttf`;
  }
  get tocXhtml(): string {
    return `${this.textDir}/${GLOBAL_CONF.tocXhtml}`;
  }
  get tocNcx(): string {
    return `${this.bookDir}/toc.ncx`;
  }
  get coverXhtml(): string {
    return `${this.textDir}/${GLOBAL_CONF.coverPrefix}.xhtml`;
  }
  get opf(): string {
    return `${this._baseDir}/${GLOBAL_CONF.opf}`;
  }
  get coverHref(): string {
    return `../${GLOBAL_CONF.imageDir}/${this._coverName}`;
  }
  get textStyleHref(): string {
    return `../${GLOBAL_CONF.styleDir}/${GLOBAL_CONF.textCss}}`;
  }
  get tocStyleHref(): string {
    return `../${GLOBAL_CONF.styleDir}/${GLOBAL_CONF.tocCss}}`;
  }
  get fontDirUrl(): string {
    return `../${GLOBAL_CONF.styleDir}`;
  }
  get containerDir(): string {
    return `${GLOBAL_CONF.outputDir}/${this._bookConf.name}/META-INF`;
  }
  get mimetype(): string {
    return `${this.bookDir}/mimetype`;
  }
}
