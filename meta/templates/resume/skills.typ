#import "templates.typ": (section-header, theme, skills, skill-entry, is-html)

#section-header("Skills")
#if is-html {
  html.elem("ul")[
    #for s in skills {
      html.elem("li")[#strong[#s.name] (#s.level/5): #s.keywords.join(", ")]
    }
  ]
} else {
  grid(
    columns: (1fr, 1fr, 1fr, 1fr),
    column-gutter: theme.spacing.medium,
    row-gutter: theme.spacing.small,
    ..skills.map(s => skill-entry(s.name, s.level, s.keywords))
  )
}
