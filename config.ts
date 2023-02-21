export const GLOBAL_CONF = {
  srcDir: `${__dirname}/data`, // dir of book raw data
  outputDir: `${__dirname}/temp`, // temporary dir for building epub
  textDir: "text",
  fontDir: "fonts",
  imageDir: "images",
  styleDir: "styles",
  textCss: "text.css",
  tocCss: "toc.css",
  coverPrefix: "cover",
  coverXhtml: "cover.xhtml",
  rightXhtml: "right.xhtml",
  titleXhtml: "title.xhtml",
  tocXhtml: "toc.xhtml",
  opf: "content.opf",
  epubRootDir: "OEBPS",
};

export const DEFAULT_CSS = {
  fontColor: "#008080",
  lineHeight: "1.6rem",
  fontFamily: "Pali",
};
