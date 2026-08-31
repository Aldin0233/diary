```js
import { Sidebar } from "./navigation.js";
import { ContextPanel } from "./context.js";


export function AppShell({
  projects,
  activeProjectId,
  context,
  main,
}) {
  return `
    <div class="app">

      ${Sidebar({
        projects,
        activeProjectId,
      })}

      <main class="main">
        ${main}
      </main>

      ${
        context
          ? ContextPanel(context)
          : ""
      }

    </div>
  `;
}
```
