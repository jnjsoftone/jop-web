// import { decodeHtmlEntities } from "jnu-web";
import { today } from "jnu-abc";
import { Pattern } from "../types";

export const blogTistory: Pattern = {
  urlPatterns: ["tistory.com"],
  fetch: async (url: string) => {
    const response = await fetch(url);
    return await response.text();
  },
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
    callback: (html: string) => html,
  },
  htmlHook: (url, title, properties, content) => {
    return content;
  },
};
