import { findFiles, loadJson } from "jnu-abc";
// const { findFiles, loadJson } from "jnu-abc";

interface Pattern {
  urlPatterns: string[];
  fetchFunction?: string;
  // 다른 필드들...
}

const getPatterns = () => {
  const files = findFiles(".", ".json").filter((file) => file != "package.json");
  console.log(files);
  const patterns = files.map((file) => loadJson(file));
  return patterns;
};

// console.log(getPatterns());

const createFunctionFromString = (functionString: string): Function => {
  // 문자열이 화살표 함수 형태인 경우 처리
  if (functionString.includes("=>")) {
    const arrowFunc = functionString.trim();
    const params = arrowFunc.substring(1, arrowFunc.indexOf("=>") - 1);
    const body = arrowFunc.substring(arrowFunc.indexOf("=>") + 2);
    return new Function(params, `return ${body}`);
  }

  // 일반 함수 형태인 경우 처리
  return new Function(`return ${functionString}`)();
};

const findPattern = (url: string) => {
  const patterns = getPatterns();
  for (const pattern of patterns as Pattern[]) {
    for (const urlPattern of pattern.urlPatterns) {
      if (url.includes(urlPattern)) {
        // fetchFunction이 있는 경우 실행 가능한 함수로 변환
        if (pattern.fetchFunction) {
          pattern.fetchFunction = createFunctionFromString(pattern.fetchFunction);
        }
        return pattern;
      }
    }
  }
  return null;
};

// 사용 예시:
const executePatternFunction = async (pattern: Pattern, url: string) => {
  if (pattern.fetchFunction) {
    const func = pattern.fetchFunction as Function;
    return await func(url);
  }
  return null;
};

export { findPattern, executePatternFunction };
