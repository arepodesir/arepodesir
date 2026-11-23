#import "templates.typ": *

#section-header("Experiences")
#if is-html {
  html.elem("ul")[
    #for e in experience {
      html.elem("li")[
        #strong[#link(e.url.href)[#e.company]] — #e.position (#e.date, #e.location)
        #par[#e.summary]
      ]
    }
  ]
} else {
  grid(
    columns: (1fr, 1fr),
    column-gutter: theme.spacing.large,
    row-gutter: theme.spacing.medium,
    ..experience.map(e => entry(
      title: e.company,
      subtitle: e.position,
      date: e.date,
      location: e.location,
      url: e.url.href,
      description: e.summary,
    ))
  )
}
