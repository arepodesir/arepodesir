#import "templates.typ": *



#section-header("Profiles")
#block(width: 100%, breakable: false)[
  #set text(font: theme.font-secondary, size: 6pt)
  #grid(
    columns: (1fr, 1fr, 1fr, 1fr, 1fr),
    gutter: 6pt,
    ..profiles.map(p => {
      box[#profile-icon(p.network) #h(1pt) #box[#p.username]]
    })
  )
]
