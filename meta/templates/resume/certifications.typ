#import "templates.typ": (section-header, theme, certifications, goal-entry, is-html)

#section-header("Certifications")
#if is-html {
  html.elem("ul")[
    #for cert in certifications {
      html.elem("li")[#strong[#cert.name] — #cert.description (#cert.date, #cert.location)]
    }
  ]
} else {
  grid(
    columns: (1fr, 1fr, 1fr, 1fr),
    column-gutter: theme.spacing.medium,
    ..certifications.map(cert => goal-entry(cert.name, cert.description, cert.date, cert.location))
  )
}
