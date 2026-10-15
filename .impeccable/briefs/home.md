# Surface Brief: Home Landing Page

## Scope
Primary landing page for Abismo.ai at `/`

## Visitor Mode
Persuade - The visitor must understand the value of agentic AI workflow, believe in its capability to automate their development process, and act by signing up or exploring the platform.

## Audience
Entreprises et équipes techniques cherchant à automatiser leurs workflows de développement logiciel avec des agents spécialisés.

## Job
Visitor needs to understand how Abismo.ai's agentic workflow can automate their software development lifecycle, from product planning to delivery, and determine if it's the right solution for their team.

## Action/Tasks
- Understand the unique multi-agent orchestration system
- See concrete examples of how agents (PM, Architect, Dev, QA, UX) collaborate
- Register for an account or request a demo
- Explore documentation or features

## Proof/Content
- Visual demonstration of agent collaboration workflow
- Concrete examples of automated workflows (PRD creation, architecture design, implementation, QA)
- Social proof: testimonials (when available), case studies (when available)
- Technical credibility: architecture overview, security features

## Constraints
- Must preserve the authentication system (JWT, endpoints)
- Must work with existing backend (FastAPI, PostgreSQL)
- Must be accessible (WCAG AA)
- Must be performant (LCP < 2.5s)
- Design system evolution: respect the spirit of Awesome-Design.md but elevate it to professional standards

## Direction contract

### THESIS
Abismo.ai is not just another project management tool—it's a mission control center for software development, where specialized agents orchestrate the entire SDLC autonomously. The surface refuses the category-default arrangement of generic hero text + feature cards, instead presenting the workflow as a living, collaborative system the visitor can watch in action.

### OWN-WORLD
The palette evolves from Awesome-Design.md's Cyan/Purple/Green into a refined, professional spectrum: deep charcoal ground (#0a0a0a), cyan accent for active states (#22d3ee), purple for intelligence layers (#a78bfa), and emerald for success/completion (#4ade80). Component language uses glassmorphism with strict opacity control (0.85-0.95), subtle borders with glow on hover, and cards that lift with physics-based easing. Typography uses Inter (Medium for body, SemiBold for hierarchy) with JetBrains Mono for technical labels, maintaining 4.5:1+ contrast throughout.

### STORY
The visitor understands that Abismo.ai replaces manual coordination with autonomous agent orchestration. They see agents (PM, Architect, Dev, QA, UX) collaborating in real-time on a visual workflow diagram. They believe this system can reduce their development cycle time while maintaining quality. They explore documentation or features to learn more about specific agent capabilities.

### FIRST VIEWPORT
A dark charcoal hero section with a centered headline "Orchestrate Your Development Lifecycle with Agentic AI" in Inter SemiBold at 3xl scale, cyan-accented phrase "Agentic AI". Below, an interactive neural network canvas (Emil Kowalski principles) showing 6 agent nodes (PM, Architect, Dev, QA, UX, Scrum Master) connected by animated synapses that pulse when data flows. The cursor triggers proximity effects—nodes illuminate and connections strengthen. A "Explore the Workflow" button (pill-shaped, cyan background, white text, lift-on-hover with shadow) sits below the canvas. The background has a subtle grid pattern with cyan/purple gradient overlays.

### FORM
Control center / mission control interface. Position 1 on ordered list. seed: none (unavailable)

### FINISH
unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Memorable Moment
The moment the visitor moves their cursor over the neural network canvas and sees agent nodes illuminate in sequence, simulating a real workflow execution with glowing synapses and smooth physics-based transitions (Emil Kowalski timing: 0.3s cubic-bezier).

## Unresolved Decisions
- Specific animation timing details (Emil Kowalski micro-interactions)
- Typography scale for responsive breakpoints (Impeccable layout)
- Color contrast refinements for accessibility (Impeccable audit)
