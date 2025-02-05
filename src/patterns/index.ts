import { blogTistory } from "./blog-tistory";
import { blogNaver } from "./blog-naver";
// ... 다른 패턴들 import
import { Pattern } from "../types";

const patterns: Pattern[] = [
  blogTistory,
  blogNaver,
  // ... 다른 패턴들
];

const findPattern = (url: string) => {
  return patterns.find((pattern) => pattern.urlPatterns.some((urlPattern) => url.includes(urlPattern)));
};

export { findPattern };
