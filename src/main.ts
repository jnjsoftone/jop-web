import { Plugin, Notice, TFile } from "obsidian";
import { fetchData } from "./core/html";
import { makeMarkdown } from "./core/markdown";
import { findPattern } from "./patterns";

export default class JopWebPlugin extends Plugin {
  async onload() {
    // 리본 아이콘 추가
    this.addRibbonIcon("clipboard-list", "URL to Markdown", async () => {
      try {
        const url = await navigator.clipboard.readText();
        if (!url.startsWith("http")) {
          new Notice("클립보드에 유효한 URL이 없습니다.");
          return;
        }
        // 패턴 찾기
        const pattern = findPattern(url);
        console.log(JSON.stringify(pattern, null, 2));
        if (!pattern) {
          new Notice("지원하지 않는 URL 형식입니다.");
          return;
        }

        // URL에서 데이터 추출
        const { title, properties, content } = await fetchData(url, pattern);
        console.log(JSON.stringify({ title, properties, content }, null, 2));

        // 마크다운 생성
        const markdown = makeMarkdown(url, title, properties, content, pattern);
        console.log(markdown);
        // 파일 생성
        const fileName = `${title}.md`;
        const existingFile = this.app.vault.getAbstractFileByPath(fileName);

        if (existingFile instanceof TFile) {
          const confirmed = await this.app.vault.adapter.exists(fileName);
          if (!confirmed) {
            new Notice("같은 이름의 파일이 이미 존재합니다.");
            return;
          }
        }

        await this.app.vault.create(fileName, markdown);
        new Notice("마크다운 파일이 생성되었습니다.");
      } catch (error) {
        console.error("Error:", error);
        new Notice(`오류가 발생했습니다: ${error.message}`);
      }
    });

    // 명령어 추가
    this.addCommand({
      id: "url-to-markdown",
      name: "URL을 마크다운으로 변환",
      callback: async () => {
        // 리본 아이콘과 동일한 동작
        const icon = this.app.workspace.containerEl.querySelector(".ribbon-url-to-markdown");
        if (icon) {
          // @ts-ignore
          icon.click();
        }
      },
    });
  }

  onunload() {
    // 플러그인 언로드 시 정리 작업
  }
}
