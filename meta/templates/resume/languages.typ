#import "templates.typ": (section-header, theme, languages, language-entry)

#section-header("Languages")
#grid(
  columns: (1fr, 1fr, 1fr, 1fr),
  column-gutter: theme.spacing.medium,
  ..languages.map(l => language-entry(l.name, l.level))
)
