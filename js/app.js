```js
import { ProjectPage } from "./pages/project.js";


const app = document.querySelector("#app");


function render() {
  app.innerHTML = ProjectPage({
    projectId: "my-app",
  });

  bindEvents();
}


function bindEvents() {

  /*
   * 프로젝트 선택
   */

  document
    .querySelectorAll("[data-project-id]")
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {

          const projectId =
            button.dataset.projectId;

          renderProject(projectId);
        }
      );

    });


  /*
   * 새 프로젝트
   */

  document
    .querySelector("#newProjectButton")
    ?.addEventListener(
      "click",
      () => {
        console.log(
          "새 프로젝트 화면"
        );
      }
    );


  /*
   * 기록하기
   */

  const input =
    document.querySelector("#ideaInput");

  document
    .querySelector("#addButton")
    ?.addEventListener(
      "click",
      () => {

        const content =
          input.value.trim();

        if (!content) return;

        console.log(
          "새 기록:",
          content
        );

        input.value = "";
      }
    );


  /*
   * ⌘ + Enter
   */

  input?.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Enter" &&
        (event.metaKey ||
          event.ctrlKey)
      ) {
        event.preventDefault();

        document
          .querySelector("#addButton")
          ?.click();
      }

    }
  );


  /*
   * 취소
   */

  document
    .querySelector("#cancelButton")
    ?.addEventListener(
      "click",
      () => {

        input.value = "";

      }
    );


  /*
   * 기록 선택
   */

  document
    .querySelectorAll("[data-record-id]")
    .forEach((entry) => {

      entry.addEventListener(
        "click",
        () => {

          const recordId =
            entry.dataset.recordId;

          console.log(
            "기록 상세:",
            recordId
          );

        }
      );

    });

}


function renderProject(projectId) {
  app.innerHTML = ProjectPage({
    projectId,
  });

  bindEvents();
}


render();
```
