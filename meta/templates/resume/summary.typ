#import "templates.typ": (developer, section-header, theme)

#section-header("Summary")
#block(width: 100%, breakable: false)[
  #set text(font: theme.font-secondary, size: 6.5pt, number-width: "tabular")
  #align(center)[#developer.metadata.description]
]
