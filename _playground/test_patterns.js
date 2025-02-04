import { findFiles, loadJson } from "jnu-abc";
// const { findFiles, loadJson } from "jnu-abc";

const getPatterns = () => {
  const files = findFiles(".", ".json").filter((file) => file != "package.json");
  console.log(files);
  const patterns = files.map((file) => loadJson(file));
  return patterns;
};

// console.log(getPatterns());

const findPattern = (url) => {
  const patterns = getPatterns();
  for (const pattern of patterns) {
    for (const urlPattern of pattern.urlPatterns) {
      if (url.includes(urlPattern)) {
        return pattern;
      }
    }
  }
  return null;
};

console.log(findPattern("https://www.tistory1.com/"));
