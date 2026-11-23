#import "templates.typ": (section-header, theme, skills, skill-entry)

#section-header("Skills")
#grid(
  columns: (1fr, 1fr, 1fr, 1fr),
  column-gutter: theme.spacing.medium,
  row-gutter: theme.spacing.small,
  ..skills.map(s => skill-entry(s.name, s.level, s.keywords))
)
