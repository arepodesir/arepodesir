#let data-path = "/" + sys.inputs.at("data", default: "dist/developer/v1.001/developer.yaml")
#let data = yaml(data-path)

#let STANDARD_GUTTER = 12pt
#let DEVELOPER_TAG = data.at("tag", default: "DEVELOPER")

#let metadata = data.metadata
#let contact = data.contact
#let goals = data.at("goals", default: ())

// Backwards-compatible structure for HEADER.typ and section templates
#let developer = (metadata: metadata)
#let arepo = (
  metadata: (metadata: contact),
  profiles: (profile: data.at("profiles", default: ())),
  certiications: (certification: data.at("certifications", default: ())),
  education: (education: data.at("education", default: ())),
  experiences: (experience: data.at("experiences", default: ())),
  languages: (language: data.at("languages", default: ())),
  projects: (project: data.at("projects", default: ())),
  skills: (skills: data.at("skills", default: ())),
)

#let raw-theme = data.at("theme", default: (:))
#let theme = (
  margin: (top: 0.3in, bottom: 0.3in, left: 0.4in, right: 0.4in),
  font-primary: raw-theme.at("font", default: (:)).at("primary", default: "Libre Baskerville"),
  font-secondary: raw-theme.at("font", default: (:)).at("secondary", default: "Libre Baskerville"),
  font-tertiary: raw-theme.at("font", default: (:)).at("tertiary", default: "Libre Baskerville"),
  font-size: 8pt,
  heading-size: 10pt,
  name-size: 18pt,
  accent-color: rgb(raw-theme.at("color", default: (:)).at("accent", default: "#f5e6a3")),
  text-color: rgb(raw-theme.at("color", default: (:)).at("text", default: "#000000")),
  link-color: rgb(raw-theme.at("color", default: (:)).at("link", default: "#ff5a86")),
  divider-color: rgb(raw-theme.at("color", default: (:)).at("divider", default: "#cccccc")),
  spacing: (
    huge: 19.42pt,
    large: 12pt,
    medium: 7.42pt,
    small: 4.59pt,
    tiny: 2.83pt,
  ),
)

#let experience = arepo.experiences.experience
#let projects = arepo.projects.project
#let skills = arepo.skills.skills
#let education = arepo.education.education
#let certifications = arepo.certiications.certification
#let languages = arepo.languages.language
#let profiles = arepo.profiles.profile
