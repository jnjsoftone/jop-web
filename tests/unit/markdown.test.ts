import { jest, describe, it, expect } from '@jest/globals';
import { makeMarkdown } from '../../src/core/markdown';
import type { Pattern } from '../../src/types';

// 테스트용 패턴 객체
const testPattern: Pattern = {
  name: 'test-blog',
  urlPatterns: ['test-blog.com'],
  fetch: async () => '',
  titleSetting: {
    selector: '.title'
  },
  contentSetting: {
    selector: '.content'
  },
  propertySettings: []
};

describe('마크다운 변환 테스트', () => {
  it('기본 마크다운 형식으로 변환해야 함', () => {
    const url = 'https://test-blog.com/post/1';
    const title = '테스트 제목';
    const properties = {
      author: '작성자',
      date: '2024-03-20'
    };
    const content = '<p>테스트 내용입니다.</p>';

    const result = makeMarkdown(url, title, properties, content, testPattern);

    expect(result).toContain('---');
    expect(result).toContain('author: "작성자"');
    expect(result).toContain('date: "2024-03-20"');
    expect(result).toContain('테스트 내용입니다');
  });

  it('makeMdFrontmatter 훅이 정상적으로 동작해야 함', () => {
    const patternWithFrontmatterHook: Pattern = {
      ...testPattern,
      makeMdFrontmatter: (url, title, properties) => {
        return `---\ntitle: ${title}\nurl: ${url}\n---`;
      }
    };

    const url = 'https://test-blog.com/post/2';
    const title = '커스텀 제목';
    const properties = {};
    const content = '<p>내용</p>';

    const result = makeMarkdown(url, title, properties, content, patternWithFrontmatterHook);

    expect(result).toContain('title: 커스텀 제목');
    expect(result).toContain('url: https://test-blog.com/post/2');
  });

  it('makeMdContent 훅이 정상적으로 동작해야 함', () => {
    const patternWithContentHook: Pattern = {
      ...testPattern,
      makeMdContent: (url, title, properties, content) => {
        return `# ${title}\n\n${content}\n\n출처: ${url}`;
      }
    };

    const url = 'https://test-blog.com/post/3';
    const title = '제목';
    const properties = {};
    const content = '내용';

    const result = makeMarkdown(url, title, properties, content, patternWithContentHook);

    expect(result).toContain('# 제목');
    expect(result).toContain('내용');
    expect(result).toContain('출처: https://test-blog.com/post/3');
  });

  it('markdownHook이 정상적으로 동작해야 함', () => {
    const patternWithMarkdownHook: Pattern = {
      ...testPattern,
      markdownHook: (url, title, frontmatter, content) => {
        return `${frontmatter}\n\n# ${title}\n\n${content}\n\n---\n원본: ${url}`;
      }
    };

    const url = 'https://test-blog.com/post/4';
    const title = '마크다운 훅 테스트';
    const properties = {};
    const content = '테스트 내용';

    const result = makeMarkdown(url, title, properties, content, patternWithMarkdownHook);

    expect(result).toContain('# 마크다운 훅 테스트');
    expect(result).toContain('테스트 내용');
    expect(result).toContain('원본: https://test-blog.com/post/4');
  });

  it('모든 훅이 순서대로 실행되어야 함', () => {
    const patternWithAllHooks: Pattern = {
      ...testPattern,
      makeMdFrontmatter: (url, title) => `---\ntitle: ${title}\nurl: ${url}\n---`,
      makeMdContent: (url, title, properties, content) => `# ${title}\n\n${content}`,
      markdownHook: (url, title, frontmatter, content) => `${frontmatter}\n\n${content}\n\n출처: ${url}`
    };

    const url = 'https://test-blog.com/post/5';
    const title = '전체 훅 테스트';
    const properties = {};
    const content = '테스트 내용';

    const result = makeMarkdown(url, title, properties, content, patternWithAllHooks);

    expect(result).toContain('title: 전체 훅 테스트');
    expect(result).toContain('url: https://test-blog.com/post/5');
    expect(result).toContain('# 전체 훅 테스트');
    expect(result).toContain('테스트 내용');
    expect(result).toContain('출처: https://test-blog.com/post/5');
  });
}); 