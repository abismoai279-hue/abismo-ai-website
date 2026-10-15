# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16.2.12 with React 19.2.4, TypeScript 5, Tailwind CSS v4

## Users

Entreprises et équipes techniques qui cherchent à automatiser leurs workflows de développement avec des agents spécialisés (Product Manager, Architect, Developer, QA, UX Designer, etc.)

## Product Purpose

Abismo.ai est une plateforme de workflow agentic IA qui permet aux équipes techniques d'automatiser et d'orchestrer leurs processus de développement logiciel à travers des agents spécialisés. Le produit permet de créer des PRDs, de concevoir des architectures, d'implémenter des features, de réaliser des QA tests, et de gérer des sprints avec une coordination autonome entre les différents agents.

Succès = Équipes techniques capables de livrer des produits logiciels plus rapidement et avec une qualité supérieure grâce à l'orchestration intelligente de agents spécialisés.

## Positioning

Le mécanisme unique d'Abismo.ai est son système de workflow agentic multi-agents qui collaborent de manière autonome pour couvrir l'ensemble du cycle de vie du développement logiciel, de la conception à la livraison. Contrairement aux outils de gestion de projet traditionnels ou aux assistants IA isolés, Abismo.ai fournit une orchestration complète avec des agents spécialisés (PM, Architect, Dev, QA, UX, etc.) qui peuvent travailler ensemble sur des projets complexes.

## Operating Context

- Environnements de développement logiciel (SDLC)
- Processus de planification de produits et de sprint
- Revues de code et validation de qualité
- Documentation technique et architecture
- Gestion de tickets et user stories
- Intégration avec systèmes d'authentification existants
- Déploiement et monitoring de production

## Capabilities and Constraints

**Capabilités:**
- Système d'authentification complet (JWT avec access/refresh tokens, bcrypt password hashing, rate limiting, session management)
- Workflow agentic avec agents spécialisés (PM, Architect, Dev, QA, UX Designer, Scrum Master, etc.)
- Gestion de PRD (Product Requirements Documents)
- Conception d'architecture technique
- Implémentation de features avec revue de code
- Tests automatisés et validation QA
- Documentation technique
- Gestion de sprints et epics
- Subscription system avec dashboard admin

**Contraintes techniques:**
- Next.js 16.2.12 avec App Router
- React 19.2.4 avec TypeScript
- Tailwind CSS v4
- FastAPI 2.0.0 pour le backend
- PostgreSQL 15 pour la base de données
- Redis 7 pour le cache (optionnel)
- Authentification JWT obligatoire pour les endpoints protégés

**Décisions en cours:**
- [DECIDED] Évoluer le design system existant vers une vision plus professionnelle selon les standards Emil/Impeccable/Taste
- [OPEN] Stratégie de build pour nouvelles surfaces (comp-first vs code-first)

## Brand Commitments

**Nom:** Abismo.ai

**Palette de couleurs actuelle (à faire évoluer):**
- Cyan (#22d3ee) - Innovation & Technologie
- Purple (#a78bfa) - Créativité & Intelligence
- Green (#4ade80) - Fiabilité & Succès
- Background principal (#0a0a0a) - Profondeur & Contraste

**Voice & Tone:**
- Professional & Technical
- Confident & Authoritative
- Clear & Concise
- Innovative yet Reliable

**Design system:** Basé sur Awesome-Design.md mais à faire évoluer vers une vision plus professionnelle et raffinée avec l'aide des skills Emil Kowalski, Impeccable, et Taste

## Evidence on Hand

- Architecture complète documentée dans ARCHITECTURE_COMPLETE.md
- Design system initial dans Awesome-Design.md
- Spécifications API dans SWAGGER_DOCUMENTATION.md
- QA reports et validation dans SYNTHESE_FINALE_QA.md
- Subscription system design dans SUBSCRIPTION_SYSTEM_DESIGN.md
- Deployment guide dans DEPLOYMENT-GUIDE.md

**Absences à noter:**
- Pas de testimonials ou case studies clients (ne pas fabriquer)
- Pas de données d'utilisation réelles (ne pas inventer)
- Pas de screenshots ou captures d'écran de l'application actuelle

## Product Principles

1. **Automation Intelligence:** Les agents agentic doivent réduire significativement le travail manuel des équipes techniques tout en maintenant ou améliorant la qualité du livrable.

2. **Security First:** L'authentification et la sécurité sont des fondements non-négociables; tous les workflows doivent respecter les standards enterprise-grade.

3. **Professional Excellence:** L'interface et l'expérience utilisateur doivent refléter un niveau de professionnalisme comparable aux grandes entreprises technologiques, avec des animations, micro-interactions, et un design system cohérent.

4. **Workflow Orchestration:** La collaboration entre agents spécialisés doit être transparente, coordonnée, et productive pour les équipes techniques.

5. **Scalability & Reliability:** La plateforme doit supporter des équipes de différentes tailles avec des performances et une fiabilité constantes.

## Accessibility & Inclusion

- Conformité WCAG AA minimum (contraste ≥ 4.5:1)
- Navigation keyboard complète
- Screen reader compatible avec semantic HTML
- ARIA labels pour components custom
- Focus visible sur tous les éléments interactifs
