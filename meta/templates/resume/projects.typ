#import "templates.typ": (section-header, theme, projects, entry, is-html)

#section-header("Projects")
#if is-html {
  html.elem("ul")[
    #for p in projects {
      let href = if type(p.url) == dictionary { p.url.href } else { p.url }
      html.elem("li")[
        #strong[#link(href)[#p.name]] — #p.description (#p.date)
        #par[#p.summary]
      ]
    }
  ]
} else {
  grid(
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
}
