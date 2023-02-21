export interface IChapter {
  title: string;
  body: string;
}

export interface IBook {
  title: string;
  chapters: IChapter[];
}
