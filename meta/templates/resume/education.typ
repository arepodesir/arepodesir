#import "templates.typ": (section-header, theme, education, DEVELOPER_TAG, education-entry, is-html)

#section-header("Education")
#if is-html {
  html.elem("ul")[
    #for e in education.filter(edu => edu.tags.contains(DEVELOPER_TAG)) {
      html.elem("li")[#strong[#e.institution] — #e.studyType in #e.area (#e.score, #e.date)]
    }
  ]
} else {
  grid(
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
}
