import { requestUrl } from "obsidian";
import { today, decodeHtml, Cheer } from "../utils";
import { Pattern } from "../types";
import { fetchSimple } from "../utils/fetch";

const fetchByRedirect = async (url: string) => {
  const html1 = await fetchSimple(url);
  const cheer = new Cheer(html1);
  const iframeSrc = cheer.value("#mainFrame", "src");
  let redirectUrl = "";

  if (iframeSrc) {
    try {
      const url = new URL(iframeSrc.startsWith("//") ? `https:${iframeSrc}` : iframeSrc);

      const blogId = url.searchParams.get("blogId");
      const logNo = url.searchParams.get("logNo");

      if (blogId && logNo) {
        redirectUrl = `https://blog.naver.com/PostView.naver?blogId=${blogId}&logNo=${logNo}&redirect=Dlog&widgetTypeCall=true&directAccess=false`;
      }

      if (!url.href.startsWith("https://blog.naver.com")) {
        const path = url.pathname + url.search;
        redirectUrl = `https://blog.naver.com${path}`;
      }
    } catch (error) {
      if (iframeSrc.startsWith("//")) redirectUrl = `https:${iframeSrc}`;
      if (iframeSrc.startsWith("/")) redirectUrl = `https://blog.naver.com${iframeSrc}`;
      if (!iframeSrc.startsWith("http")) redirectUrl = `https://blog.naver.com/${iframeSrc}`;
    }
  }

  return await fetchSimple(redirectUrl);
};

const blogNaver: Pattern = {
  urlPatterns: ["blog.naver.com"],
  fetch: async (url: string) => fetchByRedirect(url),
  titleSetting: {
    selector: "meta[property='og:title']",
    attribute: "content",
  },
  propertySettings: [
    {
      key: "author",
      selector: "meta[property='naverblog:nickname']",
      attribute: "content",
    },
    {
      key: "published",
      selector: ".date",
      attribute: "text",
    },
    {
      key: "description",
      selector: "meta[property='og:description']",
      attribute: "content",
      callback: (v: string) => decodeHtml(v),
    },
    {
      key: "tags",
      callback: () => ["clipping/blog/naver"],
    },
    {
      key: "clipped",
      callback: () => today(),
    },
  ],
  contentSetting: {
    selector: "#postListBody",
    remove: ["script", "style"],
    callback: (html: string) => html,
  },
  htmlHook: (url, title, properties, content) => {
    return { title, properties, content };
  },
};

export { blogNaver };
