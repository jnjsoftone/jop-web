import { requestUrl } from "obsidian";
import { fetchSimple, today, decodeHtml } from "../utils";
import { Pattern } from "../types";

const youtubePlaylist: Pattern = {
  urlPatterns: ["youtube.com/playlist"],
  fetch: async (url: string) => fetchSimple(url),
  titleSetting: {
    selector: "meta[property='og:title']",
    attribute: "content",
  },
  propertySettings: [
    {
      key: "author",
      selector: "meta[name='by']",
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
      callback: () => ["clipping/youtube/playlist"],
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

export {
  youtubePlaylist,
};
