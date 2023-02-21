import fs from "fs";
import { createCanvas, GlobalFonts } from "@napi-rs/canvas";

import { BaseFactory } from "../public/factory";
import { DEFAULT_CSS } from "../config";

export class Factory extends BaseFactory {
  make(): void {
    if (fs.existsSync(this._srcPath.coverImage)) {
      // copy when have provided cover image
      fs.copyFileSync(this._srcPath.coverImage, this._outputPath.coverImage);
    } else {
      // make cover with custom style
      this._makeImage();
    }
  }

  _makeImage(): void {
    // register font
    const fontFamily = this._bookConf.css.fontFamily ?? DEFAULT_CSS.fontFamily;
    if (this._bookConf.css.fontFamily) {
      GlobalFonts.registerFromPath(this._srcPath.bookFont, fontFamily);
    } else {
      GlobalFonts.registerFromPath(this._srcPath.defaultFont, fontFamily);
    }

    // init canvas
    const width = 600;
    const height = 900;
    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");

    // color of background image
    context.fillStyle = "#AD0101";
    context.fillRect(0, 0, width, height);

    // draw book name
    const title = this._bookConf.name;
    const fontSize =
      Math.round((20 / title.length) * 55) > 55
        ? 55
        : Math.round((20 / title.length) * 55);
    context.font = `${fontSize}px 'Pali'`;
    context.textAlign = "center";
    context.fillStyle = "#FFFFFF";
    context.fillText(title, width / 2, height / 6);
    context.fillText("•", width / 2, height / 3.95);

    // draw subtitle
    // const subTitle = bookConf.metadata.subject;
    // if (subTitle) {
    //   fontSize =
    //     Math.round((20 / subTitle.length) * 40) > 40
    //       ? 40
    //       : Math.round((20 / subTitle.length) * 40);
    //   context.font = `${fontSize}px 'Pali'`;
    //   context.fillText(subTitle, width / 2, height / 3);
    // }

    // draw publisher
    // const publisher = bookConf.metadata.publisher;
    // if (publisher) {
    //   context.font = "22px 'Pali'";
    //   context.fillText(publisher, width / 2, height / 1.08);
    // }

    // save as temp image
    let buffer;
    if (this._bookConf.imageType == "png") {
      buffer = canvas.toBuffer(`image/png`);
    } else {
      buffer = canvas.toBuffer("image/jpeg");
    }
    fs.writeFileSync(this._outputPath.coverImage, buffer);
  }
}
