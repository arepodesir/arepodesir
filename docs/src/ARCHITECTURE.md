# AREPODESIR README Generator - Technical Architecture

A functional, Effect-TS powered README generator that compiles TOML configurations into a beautifully formatted GitHub profile README.

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          main/main.ts                                    │
│                     (Entry Point & Runner)                               │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         main/prelude.ts                                  │
│                   (Effect Pipeline Orchestration)                        │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────────────────┐    │
│   │ loadAllConfigs│ → │ renderReadme │ → │ writeReadme              │    │
│   └──────────────┘   └──────────────┘   └──────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
                    │                │                    │
          ┌────────┴────────┐       │             ┌─────┴──────┐
          ▼                 ▼       ▼             ▼            ▼
    ┌──────────┐     ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐
    │  configs │     │ templates│ │ services │ │   lib    │ │ types  │
    │  (TOML)  │     │(renders) │ │(I/O, TUI)│ │(helpers) │ │ (ADTs) │
    └──────────┘     └──────────┘ └──────────┘ └──────────┘ └────────┘
```

---

## Template Sections (14 total)

### Required Sections
| Template | Config | Description |
|:---------|:-------|:------------|
| `renderBanner` | `banner.conf.toml` | Profile banner image and title |
| `renderHeader` | `header.conf.toml` | Quote and navigation links |
| `renderActivities` | `activities.conf.toml` | Latest projects table |
| `renderSkills` | `skills.conf.toml` | Icon tables for socials, languages, skills |
| `renderFooter` | `footer.conf.toml` | Copyright, quote, timestamp |

### Optional Sections
| Template | Config | Description |
|:---------|:-------|:------------|
| `renderBadges` | `badges.conf.toml` | Tech stack badges (shields.io) |
| `renderSocialStatus` | `social-status.conf.toml` | Mood, activity, GitHub stats |
| `renderPlugins` | `plugins.conf.toml` | GitHub README plugins (stats, trophies, snake, quote) |
| `renderEducation` | `education.conf.toml` | Academic background table |
| `renderSocialUpdates` | `social-updates.conf.toml` | Latest social media posts |
| `renderNews` | `news.conf.toml` | Curated reading list |
| `renderResume` | `resume.conf.toml` | Stylized resume download links |
| `renderFunding` | `funding.conf.toml` | Donation platforms (FUNDING.yml style) |
| `renderFAQ` | `faq.conf.toml` | Collapsible FAQ with details/summary |

---

## Core Patterns

### 1. Optional Config Loading with Effect Option
```typescript
export const loadOptionalConfig = <T>(path: string) =>
  pipe(
    loadConfig<T>(path),
    Effect.map(Option.some),
    Effect.catchTag("ConfigNotFoundError", () => Effect.succeed(Option.none()))
  );
```

### 2. Conditional Section Rendering
```typescript
const renderOptional = <T>(
    option: Option.Option<T> | undefined,
    render: (config: T) => string
): string | null => {
    if (!option || !Option.isSome(option)) return null;
    return render(option.value) || null;
};
```

### 3. FAQ with details/summary
```typescript
const renderFAQItem = (item: FAQItem): string => `
<details>
<summary><b>${item.question}</b></summary>
${item.answer}
</details>`;
```

---

## README Plugin Types

| Type | Plugin | URL Pattern |
|:-----|:-------|:------------|
| `stats` | GitHub Stats | `github-readme-stats.vercel.app/api` |
| `trophy` | GitHub Trophies | `github-profile-trophy.vercel.app` |
| `snake` | Contribution Snake | Generated SVG |
| `quote` | Dev Quote | `quotes-github-readme.vercel.app/api` |
| `activity` | Activity Graph | `github-readme-activity-graph.vercel.app` |

---

## Build & Run

```bash
# Generate README (loads 14 configs)
bun run main

# Build binary
bun run build

# Type check
npx tsc --noEmit
```

---

## D2 Diagram

See [ARCHITECTURE.d2](file:///home/arepo/LOGOS/PRAGMATA/CODE/arepodesir/docs/ARCHITECTURE.d2) for visual diagram.
