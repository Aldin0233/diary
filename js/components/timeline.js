
import {
  Badge,
  StatusIndicator,
} from "./ui.js";


export function TimelineEntry(entry) {
  const related =
    entry.related
      ?.map((item) => `<span>· ${item}</span>`)
      .join("") || "";

  return `
    <article
      class="entry"
      data-record-id="${entry.id}"
    >

      <span class="dot"></span>

      <div class="entry-card">

        <div class="entry-meta">

          <span class="time">
            ${entry.time}
          </span>

          ${
            entry.tag
              ? Badge({
                  text: entry.tag,
                  variant: "tag",
                })
              : ""
          }

        </div>

        <div class="entry-title">
          ${entry.title}
        </div>

        <div class="entry-context">
          ${entry.context}
        </div>

        ${
          entry.status || related
            ? `
              <div class="entry-footer">

                ${
                  entry.status
                    ? StatusIndicator({
                        label:
                          entry.status.label,
                        color:
                          entry.status.color,
                      })
                    : ""
                }

                ${related}

              </div>
            `
            : ""
        }

      </div>

    </article>
  `;
}


export function DayGroup(day) {
  return `
    <div class="day">

      <div class="day-title">
        ${day.date}
      </div>

      ${day.entries
        .map(TimelineEntry)
        .join("")}

    </div>
  `;
}


export function Timeline(days) {
  return `
    <section id="timeline">

      ${days
        .map(DayGroup)
        .join("")}

    </section>
  `;
}

