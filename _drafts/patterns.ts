// patterns/types.ts
export interface Pattern {
  urlPatterns: string[];
  fetch: (url: string) => Promise<string>;
  transform?: (html: string) => string;
  toMarkdown?: (html: string) => string;
}

// patterns/blog-tistory.ts
import { Pattern } from "./types";
import { reqGet } from "../request";
import { Cheer } from "../cheer";

export const tistoryPattern: Pattern = {
  urlPatterns: ["tistory.com"],
  fetch: async (url: string) => {
    const response = await reqGet(url);
    return response;
  },
  transform: (html: string) => {
    const cheer = new Cheer(html);
    cheer.del(".ads");
    return cheer.html("article");
  },
  toMarkdown: (html: string) => {
    // markdown 변환 로직
    return "";
  },
};

// patterns/index.ts
import { tistoryPattern } from "./blog-tistory";
import { naverPattern } from "./blog-naver";
// ... 다른 패턴들 import

const patterns: Pattern[] = [
  tistoryPattern,
  naverPattern,
  // ... 다른 패턴들
];

export const findPattern = (url: string) => {
  return patterns.find((pattern) => pattern.urlPatterns.some((urlPattern) => url.includes(urlPattern)));
};
