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
    const dirList = [
      this._outputPath.baseDir,
      this._outputPath.textDir,
      this._outputPath.imageDir,
      this._outputPath.fontDir,
      this._outputPath.styleDir,
      this._outputPath.containerDir,
    ]
    for (const dir of dirList) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
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
