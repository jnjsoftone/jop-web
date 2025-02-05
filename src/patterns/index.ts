import { webDefault } from "./web-default";
import { blogTistory } from "./blog-tistory";
import { blogNaver } from "./blog-naver";
import { youtubeVideo } from "./youtube-video";
import { youtubePlaylist } from "./youtube-playlist";
import { Pattern } from "../types";

const patterns: Pattern[] = [
  blogTistory,
  blogNaver,
  youtubeVideo,
  youtubePlaylist,
  webDefault  // default 패턴은 마지막에 있어야 함
];

const findPattern = (url: string) => {
  return patterns.find((pattern) => pattern.urlPatterns.some((urlPattern) => url.includes(urlPattern)))?? webDefault;
};

export { findPattern };
