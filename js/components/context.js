export function ContextBlock({
  label,
  content,
}) {
  return `
    <div class="context-block">

      <div class="context-label">
        ${label}
      </div>

      <div class="context-content">
        ${content}
      </div>

    </div>
  `;
}


export function NextActionList(actions) {
  return `
    <div class="next-action">

      ${actions
        .map(
          (action) => `
            <div>
              → ${action}
            </div>
          `
        )
        .join("")}

    </div>
  `;
}


export function TechStack(technologies) {
  return `
    <div class="tech-stack">

      ${technologies
        .map(
          (technology) => `
            <span class="tech">
              ${technology}
            </span>
          `
        )
        .join("")}

    </div>
  `;
}


export function ActivityStats({
  totalRecords,
  weeklyRecords,
}) {
  return `
    <div class="stat-row">

      <div class="stat">
        <div class="stat-number">
          ${totalRecords}
        </div>

        <div class="stat-label">
          기록
        </div>
      </div>

      <div class="stat">
        <div class="stat-number">
          ${weeklyRecords}
        </div>

        <div class="stat-label">
          이번 주
        </div>
      </div>

    </div>
  `;
}


export function ContextPanel(context) {
  return `
    <aside class="context-panel">

      <h2>
        Project Context
      </h2>

      <div class="context-subtitle">
        이 프로젝트를 다시 시작할 때 필요한 정보
      </div>


      ${ContextBlock({
        label: "현재 상태",
        content: `
          <div class="context-text">
            ${context.currentStatus}
          </div>

          <div class="progress">
            <span></span>
          </div>
        `,
      })}


      ${ContextBlock({
        label: "해결하려는 문제",
        content: `
          <div class="context-text">
            ${context.problem}
          </div>
        `,
      })}


      ${ContextBlock({
        label: "다음에 할 일",
        content: NextActionList(
          context.nextActions
        ),
      })}


      ${ContextBlock({
        label: "Tech Stack",
        content: TechStack(
          context.technologies
        ),
      })}


      ${ContextBlock({
        label: "Activity",
        content: ActivityStats({
          totalRecords:
            context.totalRecords,

          weeklyRecords:
            context.weeklyRecords,
        }),
      })}

    </aside>
  `;
}

