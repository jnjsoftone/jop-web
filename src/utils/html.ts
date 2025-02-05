// 현재 사용 중인 방식 (추가 설치 불필요)
// import { unescape, escape } from 'querystring';

// const decodeHtml = (text: string): string => {
//   return unescape(text);
// };

const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  " ": "&nbsp;",
  "/": "&#x2F;",
  "=": "&#x3D;",
  "©": "&copy;",
  "®": "&reg;",
};

const ENCODE_PATTERN = new RegExp(
  `[${Object.keys(HTML_ENTITIES)
    .map((char) => escapeRegExp(char))
    .join("")}]`,
  "g"
);

const encodeHtml = (text: string): string => {
  return text.replace(ENCODE_PATTERN, (char) => HTML_ENTITIES[char] || char);
};

const decodeHtml = (text: string): string => {
  const decodingMap = Object.entries(HTML_ENTITIES).reduce((acc, [char, entity]) => {
    acc[entity] = char;
    return acc;
  }, {} as { [key: string]: string });

  return text.replace(/&[#\w]+;/g, (entity) => decodingMap[entity] || entity);
};

// const encodeHtml = (text: string): string => {
//   return escape(text);
// };

// const encodeHtml = (unsafe: string): string => {
//   return unsafe
//     .replace(/&/g, '&amp;')
//     .replace(/</g, '&lt;')
//     .replace(/>/g, '&gt;')
//     .replace(/"/g, '&quot;')
//     .replace(/'/g, '&#039;');
// };

const escapeRegExp = (value: string): string => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const escapeMarkdown = (str: string): string => {
  return str.replace(/([[\]])/g, "\\$1");
};

const escapeValue = (value: string): string => {
  return value.replace(/"/g, '\\"').replace(/\n/g, "\\n");
};

const unescapeValue = (value: string): string => {
  return value.replace(/\\"/g, '"').replace(/\\n/g, "\n");
};

const escapeDoubleQuotes = (str: string): string => {
  return str.replace(/"/g, '\\"');
};

const formatVariables = (variables: { [key: string]: string }): string => {
  return Object.entries(variables)
    .map(([key, value]) => {
      const cleanKey = key.replace(/^{{|}}$/g, "");
      return `
        <div class="variable-item is-collapsed">
          <span class="variable-key" data-variable="${encodeHtml(key)}">${encodeHtml(cleanKey)}</span>
          <span class="variable-value">${encodeHtml(value)}</span>
          <span class="chevron-icon" aria-label="Expand">
            <i data-lucide="chevron-right"></i>
          </span>
        </div>
      `;
    })
    .join("");
};

// Cases to handle:
// Full URLs: https://example.com/x.png
// URLs without protocol: //example.com/x.png
// Relative URLs:
// - x.png
// - /x.png
// - img/x.png
// - ../x.png

const makeUrlAbsolute = (element: any, attributeName: string, baseUrl: any) => {
  const attributeValue = element.getAttribute(attributeName);
  if (attributeValue) {
    try {
      const resolvedBaseUrl = new URL(baseUrl.href);

      if (!resolvedBaseUrl.pathname.endsWith("/")) {
        resolvedBaseUrl.pathname = resolvedBaseUrl.pathname.substring(0, resolvedBaseUrl.pathname.lastIndexOf("/") + 1);
      }

      const url = new URL(attributeValue, resolvedBaseUrl);

      if (!["http:", "https:"].includes(url.protocol)) {
        const parts = attributeValue.split("/");
        const firstSegment = parts[2];

        if (firstSegment && firstSegment.includes(".")) {
          const newUrl = `${baseUrl.protocol}//` + attributeValue.split("://")[1];
          element.setAttribute(attributeName, newUrl);
        } else {
          const path = parts.slice(3).join("/");
          const newUrl = new URL(path, resolvedBaseUrl.origin + resolvedBaseUrl.pathname).href;
          element.setAttribute(attributeName, newUrl);
        }
      } else {
        const newUrl = url.href;
        element.setAttribute(attributeName, newUrl);
      }
    } catch (error) {
      console.warn(`Failed to process URL: ${attributeValue}`, error);
      element.setAttribute(attributeName, attributeValue);
    }
  }
};

// export function processUrls(htmlContent: string, baseUrl: any): string {
// 	const tempDiv = document.createElement('div');
// 	tempDiv.innerHTML = htmlContent;

// 	// Handle relative URLs for both images and links
// 	tempDiv.querySelectorAll('img').forEach(img => makeUrlAbsolute(img, 'srcset', baseUrl));
// 	tempDiv.querySelectorAll('img').forEach(img => makeUrlAbsolute(img, 'src', baseUrl));
// 	tempDiv.querySelectorAll('a').forEach(link => makeUrlAbsolute(link, 'href', baseUrl));

// 	return tempDiv.innerHTML;
// }

const formatDuration = (ms: number): string => {
  if (ms < 1000) {
    return `${Math.round(ms)}ms`;
  } else {
    return `${(ms / 1000).toFixed(2)}s`;
  }
};

export {
  encodeHtml,
  decodeHtml,
  escapeRegExp,
  escapeMarkdown,
  escapeValue,
  unescapeValue,
  escapeDoubleQuotes,
  formatVariables,
  makeUrlAbsolute,
  formatDuration,
};
