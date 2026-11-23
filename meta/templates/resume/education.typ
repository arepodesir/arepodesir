#import "templates.typ": (section-header, theme, education, DEVELOPER_TAG, education-entry)

#section-header("Education")
#grid(
  columns: (1fr, 1fr),
  column-gutter: theme.spacing.large,
  row-gutter: theme.spacing.medium,
  ..education
    .filter(edu => edu.tags.contains(DEVELOPER_TAG))
    .map(e => education-entry(
      institution: e.institution,
      degree: e.studyType,
      area: e.area,
      status: e.score,
      date: e.date,
      location: e.studyType,
    ))
)
