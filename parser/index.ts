import fs from "fs";
import { Parser as XmlParser, ParserOptions } from "xml2js";

export class Parser {
  private _parser: XmlParser;
  private _options: ParserOptions = {
    explicitRoot: false,
  };

  constructor(options?: ParserOptions) {
    this._parser = new XmlParser({ ...this._options, ...options });
  }

  protected async parse(file: string) {
    const content = fs.readFileSync(file, "utf-8");
    return this._parser
      .parseStringPromise(content)
      .then((result) => {
        return result;
      })
      .catch((error) => {
        console.error("parser error:", error);
      });
  }
}
