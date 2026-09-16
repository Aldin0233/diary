
import { AppShell } from "../components/layout.js";
import { QuickCapture } from "../components/capture.js";
import { Timeline } from "../components/timeline.js";
import { Button, Badge } from "../components/ui.js";

import {
  projects,
  projectContext,
  timeline,
} from "../data/mock.js";


export function ProjectPage({
  projectId = "my-app",
}) {
  const project = projects.find(
    (item) => item.id === projectId
  );

  if (!project) {
    return `
      <div class="empty-state">
        프로젝트를 찾을 수 없습니다.
      </div>
    `;
  }


  const main = `

    <div class="topbar">

      <div class="project-title">

        <h1>
          ${project.name}
        </h1>

        ${Badge({
          text: "PRIVATE",
          variant: "private",
        })}

      </div>

      ${Button({
        text: "프로젝트 설정",
        id: "settingsButton",
      })}

    </div>


    ${QuickCapture()}


    <div class="timeline-header">

      <h2>
        최근 기록
      </h2>

      ${Button({
        text: "전체 기록 ▾",
        className: "filter",
        id: "filterButton",
      })}

    </div>


    ${Timeline(timeline)}

  `;


  return AppShell({
    projects,
    activeProjectId: projectId,
    context: projectContext,
    main,
  });
}
