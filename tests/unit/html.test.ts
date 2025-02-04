import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import type { Pattern } from '../../src/types';
import * as patterns from '../../src/patterns';
import { fetchData } from '../../src/core/html';

// 테스트용 패턴 객체
const testPattern: Pattern = {
  name: 'test-blog',
  urlPatterns: ['test-blog.com'],
  fetch: async (url: string) => `
    <div class="blog-post">
      <h1 class="title">테스트 제목</h1>
      <div class="metadata">
        <span class="author">작성자</span>
        <span class="date">2024-03-20</span>
      </div>
      <div class="content">
        <p>테스트 내용입니다.</p>
        <div class="ad">광고</div>
        <p>본문 내용입니다.</p>
      </div>
    </div>
  `,
  titleSetting: {
    selector: '.title',
    attribute: 'text'
  },
  propertySettings: [
    { key: 'author', selector: '.author', attribute: 'text' },
    { key: 'date', selector: '.date', attribute: 'text' }
  ],
  contentSetting: {
    selector: '.content',
    remove: ['.ad']
  }
};

describe('HTML 데이터 추출 테스트', () => {
  beforeEach(() => {
    // 각 테스트 전에 모든 모킹을 초기화
    jest.resetAllMocks();
    // 콘솔 에러 무시
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // 각 테스트 후에 모킹 복원
    jest.restoreAllMocks();
  });

  it('패턴을 찾지 못할 경우 에러를 발생시켜야 함', async () => {
    const nullPattern = null as unknown as Pattern;
    jest.spyOn(patterns, 'findPattern').mockReturnValue(undefined);

    const url = 'https://unknown-blog.com/post/1';
    await expect(fetchData(url, nullPattern)).rejects.toThrow('패턴을 찾을 수 없습니다');
  });

  it('fetch 함수가 실패할 경우 에러를 발생시켜야 함', async () => {
    const patternWithFailingFetch: Pattern = {
      ...testPattern,
      fetch: async () => {
        throw new Error('네트워크 오류');
      }
    };

    jest.spyOn(patterns, 'findPattern').mockReturnValue(patternWithFailingFetch);

    const url = 'https://test-blog.com/post/error';
    await expect(fetchData(url, patternWithFailingFetch)).rejects.toThrow('네트워크 오류');
  });

  it('잘못된 선택자에 대해 에러를 발생시켜야 함', async () => {
    const invalidPattern: Pattern = {
      ...testPattern,
      contentSetting: {
        selector: '.non-existent',
        remove: []
      }
    };

    jest.spyOn(patterns, 'findPattern').mockReturnValue(invalidPattern);

    const url = 'https://test-blog.com/post/4';
    await expect(fetchData(url, invalidPattern)).rejects.toThrow('내용을 찾을 수 없습니다');
  });

  it('필수 설정이 없는 경우 에러를 발생시켜야 함', async () => {
    const invalidPattern: Pattern = {
      ...testPattern,
      titleSetting: { selector: '' },
      contentSetting: { selector: '' }
    };

    jest.spyOn(patterns, 'findPattern').mockReturnValue(invalidPattern);

    const url = 'https://test-blog.com/post/5';
    await expect(fetchData(url, invalidPattern)).rejects.toThrow('필수 선택자가 없습니다');
  });

  it('기본 데이터를 정상적으로 추출해야 함', async () => {
    // findPattern 모킹
    jest.spyOn(patterns, 'findPattern').mockReturnValue(testPattern);

    const url = 'https://test-blog.com/post/1';
    const result = await fetchData(url, testPattern);

    expect(result.title).toBe('테스트 제목');
    expect(result.properties.author).toBe('작성자');
    expect(result.content).toContain('본문 내용입니다');
  });

  it('콜백 함수가 정상적으로 동작해야 함', async () => {
    const patternWithCallback: Pattern = {
      ...testPattern,
      titleSetting: {
        ...testPattern.titleSetting,
        callback: (value?: string) => `(블로그) ${value || ''}`
      },
      contentSetting: {
        ...testPattern.contentSetting,
        callback: (content: string) => content.replace(/테스트/, '변경된')
      }
    };

    jest.spyOn(patterns, 'findPattern').mockReturnValue(patternWithCallback);

    const url = 'https://test-blog.com/post/2';
    const result = await fetchData(url, patternWithCallback);

    expect(result.title).toContain('(블로그)');
    expect(result.content).toContain('변경된');
  });

  it('HTML 후처리 훅이 정상적으로 동작해야 함', async () => {
    const patternWithHook: Pattern = {
      ...testPattern,
      htmlHook: (url, title, properties, content) => ({
        title: `${title} - 후처리`,
        properties: { ...properties, processed: true },
        content: `${content}\n<footer>후처리됨</footer>`
      })
    };

    // findPattern 모킹
    jest.spyOn(patterns, 'findPattern').mockReturnValue(patternWithHook);

    const url = 'https://test-blog.com/post/3';
    const result = await fetchData(url, patternWithHook);

    expect(result.title).toContain('후처리');
    expect(result.properties).toHaveProperty('processed', true);
    expect(result.content).toContain('후처리됨');
  });
}); 