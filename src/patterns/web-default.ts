import { requestUrl } from "obsidian";
import { fetchSimple, today, decodeHtml } from "../utils";
import { Pattern } from "../types";

export const webDefault: Pattern = {
  urlPatterns: ["http"],
  fetch: async (url: string) => fetchSimple(url),
  titleSetting: {
    selector: "title",
    attribute: "text",
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
      selector: "meta[name='description']",
      attribute: "content",
    },
    {
      key: "tags",
      callback: () => ["clipping/web/default"],
    },
    {
      key: "clipped",
      callback: () => today(),
    },
  ],
  contentSetting: {
    selector: "body",
    remove: ["script", "style"],
    callback: (html: string) => html,
  },
  htmlHook: (url, title, properties, content) => {
    return { title, properties, content };
  },
};
