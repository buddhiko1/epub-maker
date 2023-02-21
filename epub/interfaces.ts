export interface ISubChapter {
  title: string;
  id: string;
}

export interface IChapter {
  title: string;
  file: string;
  subChapters: ISubChapter[];
}

export interface IMetadata {
  title: string;
  creator: string;
  source: string;
  identifier: string;
  language: string;
  publisher: string;
}
