## Product Overview

- Product Type: Parent-Facing Educational Intelligence SaaS
- Primary Function: Tracking and analyzing child development and learning growth beyond academic grades.
- Target Audience: Parents of school-aged children (K-12).
- Monetization Model: Subscription-based (Standard Protocol $29/mo, Elite Architecture $89/mo) via Dodo Payments.
- Deployment Type: Web Application (Next.js Frontend, Node.js/Express Backend).

## Core Capabilities

- Feature 1: Neural Mapping & Growth Tracking (Synthesis of academic and behavioral data).
- Feature 2: Scientific Learning Insights (Research-based blog and dashboard recommendations).
- Feature 3: Predictive Risk Detection (AI-driven analysis of developmental trajectory).

## Surface Classification

### Public Pages (Indexable Candidates)

| Route        | Purpose                                           | Confidence |
| ------------ | ------------------------------------------------- | ---------- |
| /            | Landing page (Value Prop, Features, How it Works) | HIGH       |
| /blog        | Blog listing (Learning Hub)                       | HIGH       |
| /blog/[slug] | Individual blog articles                          | HIGH       |
| /pricing     | Plan selection and transparency statement         | HIGH       |
| /login       | User authentication entry                         | HIGH       |
| /signup      | User registration entry                           | HIGH       |
| /privacy     | Legal - Privacy Policy                            | HIGH       |
| /terms       | Legal - Terms of Service                          | HIGH       |
| /cookies     | Legal - Cookie Policy                             | HIGH       |

### Private / App Pages (Never Index)

| Route Pattern          | Reason                                    | Confidence |
| ---------------------- | ----------------------------------------- | ---------- |
| /dashboard             | User-specific student data dashboard      | HIGH       |
| /dashboard/[studentId] | Individual student progress metrics       | HIGH       |
| /onboarding            | Initial data collection and student setup | HIGH       |

## User Journey

- Entry Point: Landing page (/) or Blog articles (/blog/[slug]) via search/social.
- Core Interaction: Reviewing learning insights and setting up student profiles.
- Conversion Action: Subscription purchase via /pricing (Dodo Payments).
- Post-Conversion State: Active monitoring of student growth metrics in /dashboard.

## Content Signals

- Blog Detected: Yes (src/data/blog-posts.ts and app/blog)
- FAQ Detected: Yes (app/page.tsx, blog/[slug]/page.tsx)
- Guides / Docs: No (Content is primarily blog-based/research-based)
- Trust Pages Detected: Privacy, Terms, Cookies, Transparency Statement (on pricing)

## SEO-Safe Assumptions

- What this product IS: A professional tool for parents to understand holistic child development through data.
- What this product IS NOT: A direct tutoring service, a game for children, or a replacement for school teachers.

## Confidence Summary

- Overall Confidence Score (0–1): 0.95
- High Confidence Areas: Public routes, monetization model, target audience.
- Low Confidence Areas: Exact AI/Neural "engine" complexity (inferred as deterministic/hybrid modeling).

## SEO Execution Constraints

- Routes that must never be indexed: /dashboard/\*, /onboarding
- Routes safe for canonicalization: /, /blog, /pricing
- Areas requiring conservative SEO: /login, /signup (functional pages only)
