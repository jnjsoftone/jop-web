// import { requestUrl, TFile, Vault } from 'obsidian';
import { requestUrl } from "obsidian";
import { findPattern } from "../patterns";
import { sanitizeName, Cheer } from "../utils";
import { Pattern } from "../types";

const fetchData = async (url: string, pattern: Pattern) => {
  if (!pattern) {
    throw new Error("패턴을 찾을 수 없습니다");
  }

  const html = await pattern.fetch(url);
  console.log(`##### url: ${url} ##### html: ${html}`);
  let cheer = new Cheer(html);

  // 선택자 유효성 검사
  if (!pattern.titleSetting?.selector || !pattern.contentSetting?.selector) {
    throw new Error("필수 선택자가 없습니다");
  }

  // 제목 추출
  let title = cheer.value(pattern.titleSetting.selector, pattern.titleSetting.attribute);
  if (pattern.titleSetting.callback) {
    title = pattern.titleSetting.callback(title);
  }
  title = pattern.titleSetting.sanitize ? pattern.titleSetting.sanitize(title) : sanitizeName(title);

  // console.log(`##### title: ${title} #####`);

  // 속성 추출
  const properties = cheer.json(pattern.propertySettings ?? []);
  // console.log(`##### properties: ${JSON.stringify(properties)} #####`);

  // 내용 추출
  const $content = cheer.find(pattern.contentSetting.selector);
  let content = cheer.html($content);
  cheer = new Cheer(content);
  if (!$content.length) {
    throw new Error("내용을 찾을 수 없습니다");
  }

  if (pattern.contentSetting.remove) {
    for (const _remove of pattern.contentSetting.remove) {
      console.log(`##### _remove: ${_remove} #####`);
      cheer.del(_remove);
    }
  }
  content = cheer.html("");
  if (pattern.contentSetting.callback) {
    content = pattern.contentSetting.callback(content);
  }

  let result = { title, properties, content };
  if (pattern.htmlHook) {
    result = pattern.htmlHook(url, title, properties, content);
  }

  return result;
};

export { fetchData };
