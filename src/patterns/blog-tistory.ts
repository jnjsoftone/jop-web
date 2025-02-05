// import { decodeHtmlEntities } from "jnu-doc";
import { requestUrl } from "obsidian";
import { today } from "jnu-abc";
import { decodeHtml } from "jnu-doc";
import { Pattern } from "../types";
import { fetchSimple } from "../utils/fetch";

export const blogTistory: Pattern = {
  urlPatterns: ["tistory.com"],
  fetch: async (url: string) => fetchSimple(url),
  titleSetting: {
    selector: "meta[property='og:title']",
    attribute: "content",
  },
  propertySettings: [
    {
      key: "author",
      selector: "meta[property='tistory:author']",
      attribute: "content",
    },
    {
      key: "published",
      selector: "meta[property='article:published_time']",
      attribute: "content",
    },
    {
      key: "description",
      selector: "meta[property='og:description']",
      attribute: "content",
    },
    {
      key: "tags",
      callback: () => ["clipping/blog/tistory"],
    },
    {
      key: "clipped",
      callback: () => today(),
    },
  ],
  contentSetting: {
    selector: ".tt_article_useless_p_margin",
    remove: ["script", "style"],
    callback: (html: string) => decodeHtml(html),
  },
  htmlHook: (url, title, properties, content) => {
    return { title, properties, content };
  },
};
