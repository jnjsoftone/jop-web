import { requestUrl } from "obsidian";
import { today, decodeHtml } from "../utils";
import { Pattern } from "../types";

export const blogTistory: Pattern = {
  urlPatterns: ["tistory.com"],
  fetch: async (url: string) => {
    const response = await requestUrl({
      url,
      headers: {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "ko-KR,ko;q=0.8,en-US;q=0.5,en;q=0.3",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)",
      },
    });
    return response.text;
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
    return { title, properties, content };
  },
};
