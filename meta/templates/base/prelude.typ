#let data-path = "/" + sys.inputs.at("data", default: "dist/developer/v1.02/developer.yaml")
#let data = yaml(data-path)

#let metadata = data.at("metadata", default: (:))
#let contact = data.at("contact", default: (:))
#let raw-theme = data.at("theme", default: (:))

#let theme = (
  margin: (top: 0.5in, bottom: 0.5in, left: 0.5in, right: 0.5in),
  font-primary: raw-theme.at("font", default: (:)).at("primary", default: "Libre Baskerville"),
  font-size: 10pt,
  text-color: rgb(raw-theme.at("color", default: (:)).at("text", default: "#000000")),
  link-color: rgb(raw-theme.at("color", default: (:)).at("link", default: "#0066cc")),
)

#set page(paper: "us-letter", margin: theme.margin)
#set text(font: theme.font-primary, size: theme.font-size, fill: theme.text-color)
