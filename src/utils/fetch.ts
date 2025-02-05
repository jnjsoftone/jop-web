import { requestUrl } from "obsidian";

const fetchSimple = async (url: string) => {
  const response = await requestUrl({
    url,
    headers: {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "ko-KR,ko;q=0.8,en-US;q=0.5,en;q=0.3",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)",
    },
  });
  return response.text;
};

export { fetchSimple };
