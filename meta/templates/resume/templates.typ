#import "prelude.typ": *

#let header(persona, config) = {
  let contact = persona.metadata.metadata

  if is-html {
    html.elem("header")[
      #html.elem("h1")[#contact.name.first #contact.name.last]
      #html.elem("p")[#config.metadata.profession]
      #html.elem("p")[
        #contact.location |
        #link("tel:" + contact.phone)[#contact.phone] |
        #link("mailto:" + contact.email)[#contact.email] |
        #link(contact.website)[#contact.website]
      ]
    ]
  } else {
    block(width: 100%)[
      #set text(font: theme.font-primary, size: theme.name-size, weight: "bold")
      #contact.name.first   #contact.name.last
    ]

    block(width: 100%)[
      #set text(font: theme.font-secondary, size: 9pt)
      #config.metadata.profession
    ]

    v(1pt)

    block(width: 100%)[
      #set text(font: theme.font-secondary, size: 6.5pt)
      #box[#contact.location]
      #h(3pt) | #h(3pt)
      #box[#link("tel:" + contact.phone)[#contact.phone]]
      #h(3pt) | #h(3pt)
      #box[#link("mailto:" + contact.email)[#contact.email]]
      #h(3pt) | #h(3pt)
      #box[#link(contact.website)[#contact.website]]
    ]

    v(2pt)
    line(length: 100%, stroke: 0.5pt + theme.text-color)
  }
}


#let dot-rating(level, max: 5) = {
  let filled = "●"
  let empty = "○"
  box[
    #set text(fill: rgb("#cc3366"), size: 6.666pt)
    #for i in range(max) {
      if i < level { filled } else { empty }
      h(0.666pt)
    }
  ]
}

#let section-header(title) = {
  if is-html {
    html.elem("h2")[#title]
  } else {
    v(5pt)
    block(width: 100%)[
      #set text(font: theme.font-tertiary, size: 6.5pt, weight: "bold")
      #title
      #v(-3pt)
      #line(length: 100%, stroke: 0.4pt + theme.text-color)
    ]
    v(2pt)
  }
}


#let highlight-box(content) = {
  box(
    fill: theme.accent-color,
    inset: (x: 2pt, y: 0.5pt),
    radius: 1pt,
  )[#set text(weight: "bold", size: 6.5pt); #content]
}


#let entry(
  title: "",
  subtitle: "",
  date: "",
  location: "",
  url: none,
  description: "",
) = {
  block(width: 100%, below: theme.spacing.small, breakable: false)[
    #grid(
      columns: (1fr, auto),
      align: (left, right),
      [
        #set text(font: theme.font-secondary, weight: "bold", size: 7pt)
        #box[#title]
      ],
      [
        #set text(font: theme.font-secondary, size: 6pt)
        #box[#date]
        #if location != "" [ #h(4pt) #box[#location]]
      ],
    )
    #if subtitle != "" or url != none [
      #set text(font: theme.font-secondary, size: 6pt)
      #box[#subtitle]
      #if url != none [

        #box[#link(url)[#set text(size: 5pt); #url]]
      ]
    ]
    #if description != "" [
      #v(1pt)
      #set text(font: theme.font-secondary, size: 6pt, style: "italic")
      #description
    ]
  ]
}

#let education-entry(
  institution: "",
  degree: "",
  area: "",
  status: "",
  date: "",
  location: "",
) = {
  block(width: 100%, below: theme.spacing.tiny, breakable: false)[
    #grid(
      columns: (1fr, auto),
      align: (left, right),
      [
        #set text(font: theme.font-secondary, weight: "bold", size: 6.5pt)
        #box[#institution]
      ],
      [
        #set text(font: theme.font-secondary, size: 6pt)
        #box[#date]
      ],
    )
    #set text(font: theme.font-secondary, size: 6pt)
    #box[#area] #h(1fr) #box[#location]
    #linebreak()
    #status
  ]
}

#let skill-entry(name, level, keywords) = {
  block(width: 100%, breakable: false)[
    #set text(font: theme.font-secondary, weight: "bold", size: 6.5pt)
    #box[#name]
    #linebreak()
    #dot-rating(level)
    #v(1pt)
    #set text(font: theme.font-secondary, size: 5pt, weight: "regular")
    #keywords.join(", ")
  ]
}

#let language-entry(name, level) = {
  block(width: 100%, breakable: false)[
    #set text(font: theme.font-secondary, weight: "bold", size: 6.5pt)
    #box[#name]
    #linebreak()
    #dot-rating(level)
  ]
}

#let goal-entry(name, description, date, location) = {
  block(width: 100%, breakable: false)[
    #set text(font: theme.font-secondary, size: 6pt)
    #text(weight: "bold")[#box[#name]] #h(1fr) #box[#date]
    #linebreak()
    #box[#description] #h(1fr) #box[#location]
  ]
}

#let profile-icon(network) = {
  let icons = (
    "Github": "GITHUB",
    "Linkedin": "LINKEDIN",
    "Instagram": "INSTAGRAM",
    "Devto": "DEV.TO",
    "Upwork": "UPWORK",
  )
  set text(font: theme.font-secondary, size: 6pt)
  box(
    fill: luma(240),
    inset: 1.5pt,
    radius: 1pt,
  )[#icons.at(network, default: "•")]
}
