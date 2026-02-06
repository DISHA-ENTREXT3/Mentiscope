# Mentiscope - SEO Master Plan

This document outlines the Search Engine Optimization strategy and implementation details for Mentiscope.

## 1. Sitemap Overview

The sitemap is structured to maximize visibility for public, value-driven pages while strictly protecting user-specific data routes. It prioritizes the conversion funnel (Home -> Pricing -> Signup) and the educational content (Blog) that drives organic traffic. Dashboard and onboarding flows are explicitly excluded to preserve crawl budget and security.

## 2. Final URL Structure

### Core Identity

- `https://mentiscope.com/` (Home)
- `https://mentiscope.com/signup` (Registration)
- `https://mentiscope.com/login` (Authentication)
- `https://mentiscope.com/pricing` (Tiers & Value)

### Content & Growth

- `https://mentiscope.com/blog` (Educational Hub)

### Trust & Legal

- `https://mentiscope.com/about` (Mission & Team)
- `https://mentiscope.com/privacy` (Data Protection)
- `https://mentiscope.com/terms` (Service Conditions)

_(Note: `user` state pages like `/dashboard` and `/onboarding` are excluded)_

## 3. SEO Artifacts

- **Sitemap**: `/public/sitemap.xml` (Generated)
- **Robots**: `/public/robots.txt` (Generated)

## 4. Page Intent Mapping Table

| URL        | Page Purpose       | Primary User Question                               | SEO / AI Intent            |
| :--------- | :----------------- | :-------------------------------------------------- | :------------------------- |
| `/`        | Brand Introduction | "What is Mentiscope and how does it help my child?" | Informational / Commercial |
| `/pricing` | Value Proposition  | "How much does it cost and is it verified?"         | Commercial / Transactional |
| `/blog`    | Education & Trust  | "How can I support my child's learning style?"      | Informational              |
| `/signup`  | Conversion         | "Where do I start?"                                 | Transactional              |
| `/about`   | Trust Signal       | "Who built this and is my data safe?"               | Informational              |

## 5. AEO + AI-SEO Checklist

| Sitemap URL | Primary Question Answered           | Required FAQs (3-5)                                                             | Content Length | Internal Linking       |
| :---------- | :---------------------------------- | :------------------------------------------------------------------------------ | :------------- | :--------------------- |
| **Home**    | What is holistic learning tracking? | 1. Is my data safe? <br> 2. What ages is this for? <br> 3. Is it AI?            | 800+ words     | Link to Blog, Pricing  |
| **Pricing** | Is the cost justified?              | 1. Can I cancel anytime? <br> 2. Is there a free trial? <br> 3. Secure payment? | 500+ words     | Link to Signup, Trust  |
| **Blog**    | Specific learning queries           | _Topic dependent_                                                               | 1200+ words    | Link to Home, Features |

## 6. Implementation Notes

- **Meta Tags**: Ensure every public page has a unique `title` and `description` in `layout.tsx` or `page.tsx` metadata.
- **Structured Data**: Implement `Organization` schema on Home and `Article` schema on Blog posts.
- **Performance**: Vercel Analytics and Speed Insights are recommended for monitoring Core Web Vitals.
