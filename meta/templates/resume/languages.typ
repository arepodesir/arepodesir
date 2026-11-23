#import "templates.typ": (section-header, theme, languages, language-entry, is-html)

#section-header("Languages")
#if is-html {
  html.elem("ul")[
    #for l in languages {
      html.elem("li")[#strong[#l.name] (#l.level/5)]
    }
  ]
} else {
  grid(
    columns: (1fr, 1fr, 1fr, 1fr),
    column-gutter: theme.spacing.medium,
    ..languages.map(l => language-entry(l.name, l.level))
  )
}
