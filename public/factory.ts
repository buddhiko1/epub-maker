import { IConf as IBookConf } from "../book/interfaces";
import { SrcPath, OutputPath } from "./path";

export abstract class BaseFactory {
  protected _srcPath: SrcPath;
  protected _outputPath: OutputPath;

  constructor(protected _bookConf: IBookConf) {
    this._srcPath = new SrcPath(this._bookConf);
    this._outputPath = new OutputPath(this._bookConf);
  }
}
