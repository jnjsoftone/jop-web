export type TitleSetting = {
  selector: string;
  attribute?: string; // default: text
  callback?: (value?: string) => string;
  sanitize?: (value: string) => string; // default: sanitizeName
};

export type PropertySetting = {
  key: string;
  selector?: string;
  attribute?: string; // default: text
  callback?: (value?: string) => any;
};

export type ContentSetting = {
  selector: string;
  remove?: string[];
  callback?: (html: string) => any;
};

export type HtmlHook = (url: string, title: string, properties: PropertySetting[], content: string) => any;
export type MdFrontmatterHook = (url: string, title: string, properties: PropertySetting[], content: string) => string;
export type MdContentHook = (url: string, title: string, properties: PropertySetting[], content: string, template: string) => string;
export type MdHook = (url: string, title: string, frontmatter: string, content: string, template: string) => string;

export interface Pattern {
  name?: string;
  urlPatterns: string[];
  fetch: (url: string) => Promise<string>;
  titleSetting: TitleSetting;
  propertySettings: PropertySetting[];
  contentSetting: ContentSetting;
  htmlHook?: HtmlHook;
  makeMdFrontmatter?: MdFrontmatterHook;
  makeMdContent?: MdContentHook;
  markdownHook?: MdHook;
}
