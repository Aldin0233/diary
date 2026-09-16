
import { Button } from "./ui.js";


export function QuickCapture({
  placeholder = "지금 떠오른 생각을 기록하세요...",
}) {
  return `
    <section class="capture">

      <textarea
        id="ideaInput"
        placeholder="${placeholder}"
      ></textarea>

      <div class="capture-bottom">

        <div class="capture-hint">
          ⌘ + Enter 로 빠르게 기록
        </div>

        <div class="capture-actions">

          ${Button({
            text: "취소",
            id: "cancelButton",
          })}

          ${Button({
            text: "기록하기",
            variant: "primary",
            id: "addButton",
          })}

        </div>

      </div>

    </section>
  `;
}

