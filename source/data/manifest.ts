export const manifest = (): Manifest["local" | "cloud"] => {
  return data.local
}

type Manifest = typeof data

const data = {
  cloud: {} as const,
  local : [
    "banner",
    "header",
    "badges",
    "activities",
    "news",
    "skills",
    "social-updates",
    "resume",
    "funding",
    "faq",
    "footer",
  ]
} as const 

