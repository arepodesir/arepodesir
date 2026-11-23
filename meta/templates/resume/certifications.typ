#import "templates.typ": (section-header, theme, certifications, goal-entry)

#section-header("Certifications")
#grid(
  columns: (1fr, 1fr, 1fr, 1fr),
  column-gutter: theme.spacing.medium,
  ..certifications.map(cert => goal-entry(cert.name, cert.description, cert.date, cert.location))
)