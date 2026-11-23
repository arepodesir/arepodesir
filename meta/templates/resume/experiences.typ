#import "templates.typ": *

#section-header("Experiences")
#grid(
  columns: (1fr, 1fr),
  column-gutter: theme.spacing.large,
  row-gutter: theme.spacing.medium,
  ..experience.map(e => entry(
    title: e.company,
    subtitle: e.position,
    date: e.date,
    location: e.location,
    url: e.url.href,
    description: e.summary,
  ))
)