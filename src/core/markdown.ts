import { mdContent, mdFrontmatter } from "../utils";
import type { Pattern } from "../types";

const makeMarkdown = (url: string, title: string, properties: any, content: string, pattern: Pattern) => {
  let frontmatter = mdFrontmatter(properties);
  if (pattern.makeMdFrontmatter) {
    frontmatter = pattern.makeMdFrontmatter(url, title, properties, content);
  }

  let _content = mdContent(content);
  const template = "";
  let result = "";
  if (pattern.makeMdContent) {
    _content = pattern.makeMdContent(url, title, properties, content, template);
  }

  if (pattern.markdownHook) {
    result = pattern.markdownHook(url, title, frontmatter, _content, template);
  } else {
    result = `${frontmatter}\n${_content}`;
  }

  return result;
};

export { makeMarkdown };
