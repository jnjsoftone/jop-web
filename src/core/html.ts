// import { requestUrl, TFile, Vault } from 'obsidian';
import { findPattern } from "../patterns";
import { sanitizeName } from "jnu-abc";
import { Cheer } from "jnu-web";
import { Pattern } from "../types";

const fetchData = async (url: string, pattern: Pattern) => {

  if (!pattern) {
    throw new Error('패턴을 찾을 수 없습니다');
  }

  const html = await pattern.fetch(url);
  const cheer = new Cheer(html);

  // 선택자 유효성 검사
  if (!pattern.titleSetting?.selector || !pattern.contentSetting?.selector) {
    throw new Error('필수 선택자가 없습니다');
  }

  // 제목 추출
  let title = cheer.value(pattern.titleSetting.selector, pattern.titleSetting.attribute);
  if (pattern.titleSetting.callback) {
    title = pattern.titleSetting.callback(title);
  }
  title = pattern.titleSetting.sanitize ? pattern.titleSetting.sanitize(title) : sanitizeName(title);

  // 속성 추출
  const properties = cheer.json(pattern.propertySettings ?? []);

  // 내용 추출
  const $content = cheer.find(pattern.contentSetting.selector);
  if (!$content.length) {
    throw new Error('내용을 찾을 수 없습니다');
  }

  if (pattern.contentSetting.remove) {
    for (const remove of pattern.contentSetting.remove) {
      $content.remove(remove);
    }
  }
  let content = cheer.html($content);
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