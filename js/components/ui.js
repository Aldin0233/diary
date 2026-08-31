```js
export function Button({
  text,
  variant = "default",
  className = "",
  id = "",
  type = "button",
}) {
  return `
    <button
      type="${type}"
      class="btn btn-${variant} ${className}"
      ${id ? `id="${id}"` : ""}
    >
      ${text}
    </button>
  `;
}


export function Badge({
  text,
  variant = "default",
}) {
  return `
    <span class="badge badge-${variant}">
      ${text}
    </span>
  `;
}


export function StatusIndicator({
  label,
  color = "var(--yellow)",
}) {
  return `
    <span class="status">
      <span
        class="status-dot"
        style="background:${color}"
      ></span>

      ${label}
    </span>
  `;
}
```
