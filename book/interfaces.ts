import { ICss } from "../css/interfaces";
import { IMetadata } from "../epub/interfaces";

export interface IConf {
  name: string;
  metadata: IMetadata;
  css: ICss;
  imageType: string; // jpeg or png
}
