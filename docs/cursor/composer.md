

```prompt
@index.ts 에서 url을 기준으로 웹페이지를 스크래핑할 설정을 json 파일을 사용하는 방법을 사용하는데, json 파일로 하는 경우, `"fetchFunction": "(url)=>{return fetch(url)}",`  와 같이 callback 함수를 문자로 넘긴 후, 함수를 실행하려면 어떻게 하나요?
```


문자열로 된 함수를 실행 가능한 함수로 변환하기 위해서는 `Function` 생성자나 `eval`을 사용할 수 있습니다. 보안상의 이유로 `Function` 생성자를 사용하는 것이 더 안전합니다.

```typescript:Utils/jop-web/src/patterns/index.ts
// ... existing code ...

interface Pattern {
  urlPatterns: string[];
  fetchFunction?: string;
  // 다른 필드들...
}

const createFunctionFromString = (functionString: string): Function => {
  // 문자열이 화살표 함수 형태인 경우 처리
  if (functionString.includes('=>')) {
    const arrowFunc = functionString.trim();
    const params = arrowFunc.substring(1, arrowFunc.indexOf('=>')-1);
    const body = arrowFunc.substring(arrowFunc.indexOf('=>')+2);
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
```

이제 JSON 파일에서 다음과 같이 함수를 정의할 수 있습니다:

```json
{
  "urlPatterns": ["example.com"],
  "fetchFunction": "(url) => { return fetch(url).then(res => res.text()) }",
  // 또는
  "fetchFunction": "function(url) { return fetch(url).then(res => res.text()) }"
}
```

그리고 다음과 같이 사용할 수 있습니다:

```typescript
const pattern = findPattern("https://example.com");
if (pattern) {
  const result = await executePatternFunction(pattern, "https://example.com");
  console.log(result);
}
```

주의사항:
1. 문자열로 된 함수를 실행하는 것은 보안상 위험할 수 있으므로, 신뢰할 수 있는 소스의 JSON 파일만 사용해야 합니다.
2. 화살표 함수와 일반 함수 모두 지원하도록 구현했습니다.
3. 비동기 함수도 지원됩니다.


---

```prompt
설정을 json 파일로 만들고 불러오는 것과, '.ts' 파일로 만들어서 import 하는 것에 대한 장.단점을 비교하고, 현재 목적(url에 대한 pattern을 추가 설정하고, 그 설정에 따라, fetch, html 수정, markdown 생성, ...)에 더 적합한 방법을 추천해주세요
```


두 방식의 장단점을 비교해보겠습니다:

**JSON 파일 방식**
장점:
1. 설정 변경이 쉽고 빠름 (코드 재컴파일 불필요)
2. 비개발자도 쉽게 수정 가능
3. 다른 시스템과의 호환성이 좋음
4. 설정 파일을 동적으로 추가/제거 가능

단점:
1. 함수를 문자열로 저장해야 하며, 실행 시 변환 필요
2. 타입 안정성이 떨어짐
3. 복잡한 로직 구현이 어려움
4. IDE의 자동완성/타입 체크 지원이 제한적
5. 보안 위험 (eval과 유사한 문제)

**TypeScript 파일 방식**
장점:
1. 완벽한 타입 안정성
2. IDE 지원 (자동완성, 타입 체크, 리팩토링)
3. 복잡한 로직 구현 가능
4. 더 안전한 함수 실행
5. 테스트 작성이 용이

단점:
1. 설정 변경 시 재컴파일 필요
2. 비개발자가 수정하기 어려움
3. 설정 파일 동적 추가가 어려움

**현재 목적에 대한 추천:**
현재 목적(URL 패턴 매칭, fetch, HTML 수정, Markdown 생성)을 고려할 때 **TypeScript 파일 방식**을 추천합니다.

이유:
1. 복잡한 HTML 처리와 Markdown 변환 로직이 필요
2. 타입 안정성이 중요 (오류 방지)
3. 함수형 프로그래밍 스타일로 작성 가능
4. 테스트 작성이 용이

구현 예시:
```typescript
// patterns/types.ts
export interface Pattern {
  urlPatterns: string[];
  fetch: (url: string) => Promise<string>;
  transform?: (html: string) => string;
  toMarkdown?: (html: string) => string;
}

// patterns/blog-tistory.ts
import { Pattern } from './types';
import { reqGet } from '../request';
import { Cheer } from '../cheer';

export const tistoryPattern: Pattern = {
  urlPatterns: ['tistory.com'],
  fetch: async (url: string) => {
    const response = await reqGet(url);
    return response;
  },
  transform: (html: string) => {
    const cheer = new Cheer(html);
    cheer.del('.ads');
    return cheer.html('article');
  },
  toMarkdown: (html: string) => {
    // markdown 변환 로직
    return '';
  }
};

// patterns/index.ts
import { tistoryPattern } from './blog-tistory';
import { naverPattern } from './blog-naver';
// ... 다른 패턴들 import

const patterns: Pattern[] = [
  tistoryPattern,
  naverPattern,
  // ... 다른 패턴들
];

export const findPattern = (url: string) => {
  return patterns.find(pattern => 
    pattern.urlPatterns.some(urlPattern => url.includes(urlPattern))
  );
};
```

이 방식의 장점:
1. 타입 안정성
2. 패턴별로 파일 분리 가능
3. 테스트 작성 용이
4. 복잡한 로직 구현 가능
5. IDE 지원
6. 안전한 함수 실행

만약 설정의 동적 변경이 매우 중요하다면, 하이브리드 접근도 가능합니다:
- 핵심 로직은 TypeScript로 구현
- 간단한 설정값들(URL 패턴, 선택자 등)만 JSON으로 관리
