import fs from "fs";
import Handlebars from "handlebars";

import { BaseFactory } from "../public/factory";
import { DEFAULT_CSS } from "../config";

export class Factory extends BaseFactory {
  make(): void {
    // copy when user have provided css file
    if (fs.existsSync(this._srcPath.textCss)) {
      fs.copyFileSync(this._srcPath.textCss, this._outputPath.textCss);
    } else {
      this._makeTextCss();
    }
    if (fs.existsSync(this._srcPath.tocCss)) {
      fs.copyFileSync(this._srcPath.tocCss, this._outputPath.tocCss);
    } else {
      this._makeTocCss();
    }
  }

  private _makeTextCss() {
    const contents = fs.readFileSync(`${__dirname}/text.css.template`, "utf8");
    const template = Handlebars.compile(contents);
    const fontFamily = this._bookConf.css.fontFamily ?? DEFAULT_CSS.fontFamily;
    const data = {
      fontColor: this._bookConf.css.fontColor ?? DEFAULT_CSS.fontColor,
      fontFamily: fontFamily,
      fontUrl: `${this._outputPath.fontDirUrl}/${fontFamily}.ttf`,
      lineHeight: this._bookConf.css.lineHeight ?? DEFAULT_CSS.lineHeight,
    };
    const resultString = template(data);
    fs.writeFileSync(this._outputPath.textCss, resultString, "utf-8");
  }

  private _makeTocCss() {
    fs.copyFileSync(`${__dirname}/toc.css.template`, this._outputPath.tocCss);
  }
}
