import fs from "fs";

import { BaseFactory } from "../public/factory";
import { Factory as CssFactory } from "../css";
import { Factory as CoverFactory } from "../cover";
import { Factory as EpubFactory } from "../epub";

export class Factory extends BaseFactory {
  async make(): Promise<void> {
    this._init();
    // make cover
    const coverFactory = new CoverFactory(this._bookConf);
    coverFactory.make();
    // make css
    const cssFactory = new CssFactory(this._bookConf);
    cssFactory.make();
    // make epub
    const epubFactory = new EpubFactory(this._bookConf);
    await epubFactory.make();
    // this._clear();
  }

  private _init(): void {
    if (!fs.existsSync(this._outputPath.baseDir)) {
      fs.mkdirSync(this._outputPath.baseDir, { recursive: true });
    }
    if (!fs.existsSync(this._outputPath.textDir)) {
      fs.mkdirSync(this._outputPath.textDir, { recursive: true });
    }
    if (!fs.existsSync(this._outputPath.imageDir)) {
      fs.mkdirSync(this._outputPath.imageDir, { recursive: true });
    }
    if (!fs.existsSync(this._outputPath.fontDir)) {
      fs.mkdirSync(this._outputPath.fontDir, { recursive: true });
    }
    if (!fs.existsSync(this._outputPath.styleDir)) {
      fs.mkdirSync(this._outputPath.styleDir, { recursive: true });
    }
    if (!fs.existsSync(this._outputPath.containerDir)) {
      fs.mkdirSync(this._outputPath.containerDir, { recursive: true });
    }
  }

  private _clear(): void {
    // clear temporary files
    const tempDir = this._outputPath.bookDir;
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
}
