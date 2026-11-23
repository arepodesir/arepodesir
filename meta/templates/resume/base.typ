#import "prelude.typ": *

#set page(
  paper: "us-letter",
  margin: theme.margin,
)

#set text(
  font: theme.font-primary,
  size: theme.font-size,
  fill: theme.text-color,
  hyphenate: false, 
)

#set par(
  justify: true,
  leading: 0.45em,
)

#set block(breakable: false)

#show link: it => {
  set text(fill: theme.link-color)
  box[#underline(it)]
}
