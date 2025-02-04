// import { requestUrl, TFile, Vault } from 'obsidian';
import { findPattern } from "../patterns";
import { sanitizeName } from "jnu-abc";
import { Cheer } from "jnu-web";
import { Pattern } from "../types";

const fetchData = async (url: string) => {
  const pattern = findPattern(url);
  const html = await pattern!.fetch(url);

  // * title, properties, content
  const cheer = new Cheer(html);
  let { selector, attribute, callback, sanitize } = pattern!.titleSetting!;
  let title = cheer.value(selector, attribute);
  if (callback) {
    title = callback(cheer.value(selector, attribute));
  }
  title = sanitize ? sanitize(title) : sanitizeName(title);

  const properties = cheer.json(pattern!.propertySettings!);

  const $content = cheer.find(pattern!.contentSetting.selector);
  if (pattern!.contentSetting.remove) {
    for (const remove of pattern!.contentSetting.remove) {
      $content.remove(remove);
    }
  }
  let content = cheer.html($content);
  if (pattern!.contentSetting.callback) {
    content = pattern!.contentSetting.callback(content);
  }

  return { html, title, properties, content };
};
