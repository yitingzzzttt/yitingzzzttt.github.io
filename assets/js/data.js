// ============================================================================
// Site content that more than one page reads. To add a project, add one entry
// to PROJECTS and create its folder in work/<slug>/ from work/_template/.
// ============================================================================

window.SITE = {
  name: "Yiting Zhong",
  tagline: "Planning, spatial data and design.",
  intro: "Placeholder intro line.",
  email: "zyting0107@outlook.com",
  linkedin: "https://www.linkedin.com/in/yiting-zhong-99377a303",
  location: "Philadelphia, PA",
};

// Categories used by the Work page filters. The key is what PROJECTS use in `cat`.
window.CATS = { planning: "Planning", architecture: "Architecture", research: "Research" };

// One entry per project.
//   slug     folder name under work/, also the project's URL
//   title    project name
//   cat      one key from CATS
//   date     "YYYY-MM", used for sorting and shown as e.g. "May.2026"
//   kind     short type, e.g. "Neighborhood plan"
//   role     what YOU did, e.g. "Greenspace strategy lead"
//   blurb    two or three short lines, shown on hover
//   ink      the one ink colour of the project's halftone cover
//   cover    path to the cover image (relative to the site root), or null for a placeholder
//   image    optional full-colour image for hover; defaults to `cover`
//   lum      optional 0.45–1.1, lightens or darkens the halftone for this image (default .72)
//   draft    true = hidden everywhere on the site (work in progress)
//   placeholder  true = stand-in project, remove before real launch
window.PROJECTS = [
  { slug: "project-01", title: "Project One",   cat: "planning",     date: "2026-05", kind: "Neighborhood plan", role: "Role placeholder",             blurb: "Placeholder introduction. Two or three short lines saying what the project is and what you did.", ink: "#2a3aa8", cover: null, placeholder: true },
  { slug: "project-02", title: "Project Two",   cat: "architecture", date: "2024-04", kind: "Housing design",    role: "Individual project",           blurb: "Placeholder introduction. Two or three short lines saying what the project is and what you did.", ink: "#2f7d4f", cover: null, placeholder: true },
  { slug: "project-03", title: "Project Three", cat: "research",     date: "2026-04", kind: "GIS analysis",      role: "Research, writing",            blurb: "Placeholder introduction. Two or three short lines saying what the project is and what you did.", ink: "#c5262e", cover: null, placeholder: true },
  { slug: "project-04", title: "Project Four",  cat: "planning",     date: "2025-09", kind: "Case study",        role: "Sole author",                  blurb: "Placeholder introduction. Two or three short lines saying what the project is and what you did.", ink: "#1b1b1b", cover: null, placeholder: true },
  { slug: "project-05", title: "Project Five",  cat: "architecture", date: "2023-09", kind: "Studio project",    role: "Team of three · your part",    blurb: "Placeholder introduction. Two or three short lines saying what the project is and what you did.", ink: "#d6418c", cover: null, placeholder: true },
  { slug: "project-06", title: "Project Six",   cat: "research",     date: "2025-06", kind: "Neighborhood plan", role: "Role placeholder",             blurb: "Placeholder introduction. Two or three short lines saying what the project is and what you did.", ink: "#0f7f86", cover: null, placeholder: true },
  { slug: "project-07", title: "Project Seven", cat: "architecture", date: "2023-06", kind: "GIS analysis",      role: "Individual project",           blurb: "Placeholder introduction. Two or three short lines saying what the project is and what you did.", ink: "#5a3fc4", cover: null, placeholder: true },
  { slug: "project-08", title: "Project Eight", cat: "planning",     date: "2026-12", kind: "Housing design",    role: "Greenspace strategy, mapping", blurb: "Placeholder introduction. Two or three short lines saying what the project is and what you did.", ink: "#dd5a1a", cover: null, placeholder: true },
  { slug: "project-09", title: "Project Nine",  cat: "research",     date: "2025-05", kind: "GIS analysis",      role: "Individual project",           blurb: "Placeholder introduction. Two or three short lines saying what the project is and what you did.", ink: "#8a6a12", cover: null, placeholder: true },
  { slug: "project-10", title: "Project Ten",   cat: "architecture", date: "2024-12", kind: "Case study",        role: "Research, writing",            blurb: "Placeholder introduction. Two or three short lines saying what the project is and what you did.", ink: "#3d5a80", cover: null, placeholder: true },
];
