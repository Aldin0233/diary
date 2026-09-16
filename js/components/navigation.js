
import { Button } from "./ui.js";


export function Logo() {
  return `
    <div class="logo">
      <div class="logo-mark">C</div>
      <span>Context</span>
    </div>
  `;
}


export function ProjectItem(project, active = false) {
  return `
    <button
      class="project ${active ? "active" : ""}"
      data-project-id="${project.id}"
    >
      <div class="project-left">

        <span
          class="project-icon"
          style="background:${project.color}"
        ></span>

        <span class="project-name">
          ${project.name}
        </span>

      </div>

      <span class="count">
        ${project.recordCount}
      </span>
    </button>
  `;
}


export function ProjectList(
  projects,
  activeProjectId
) {
  return `
    <div class="project-list">

      ${projects
        .map((project) =>
          ProjectItem(
            project,
            project.id === activeProjectId
          )
        )
        .join("")}

    </div>
  `;
}


export function Sidebar({
  projects,
  activeProjectId,
}) {
  return `
    <aside class="sidebar">

      ${Logo()}

      <div class="section-label">
        Projects
      </div>

      ${ProjectList(
        projects,
        activeProjectId
      )}

      ${Button({
        text: "+ 새 프로젝트",
        variant: "ghost",
        className: "new-project",
        id: "newProjectButton",
      })}

    </aside>
  `;
}

