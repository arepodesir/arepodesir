#import "templates.typ": (section-header, theme, projects, entry)

#section-header("Projects")
#grid(
  columns: (1fr, 1fr),
  column-gutter: theme.spacing.large,
  row-gutter: theme.spacing.medium,
  ..projects.map(p => entry(
    title: p.name,
    subtitle: p.description,
    date: p.date,
    url: if type(p.url) == dictionary { p.url.href } else { p.url },
    description: p.summary,
  ))
)
