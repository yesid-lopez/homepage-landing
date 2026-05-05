# Homepage Landing — Kubernetes Homelab

A public, security-conscious landing page for Yesid Lopez's Kubernetes homelab.

The site presents the platform architecture, GitOps workflow, workload categories, observability practices, and security posture of a private homelab without exposing sensitive operational details such as IP addresses, hostnames, credentials, internal paths, or exact hardware topology.

## What this project showcases

- **Kubernetes platform engineering** — a compact self-hosted runtime for applications, experiments, and automation.
- **GitOps delivery** — infrastructure and workloads modeled as code and reconciled from Git.
- **Secure operations** — encrypted secrets, reviewed configuration changes, controlled ingress, and TLS automation.
- **Observability** — metrics, logs, dashboards, and alerts for operational feedback.
- **AI/ML-ready lab environment** — a private platform for testing services, automation, and model-adjacent tooling.
- **Sanitized public documentation** — enough architectural context to communicate the design without leaking private infrastructure details.

## Tech stack

- [Next.js](https://nextjs.org/) 16
- [React](https://react.dev/) 19
- TypeScript
- CSS modules/global CSS through the Next.js App Router

## Project structure

```text
.
├── app/
│   ├── globals.css    # Visual design and responsive styling
│   ├── layout.tsx     # Site metadata and root layout
│   └── page.tsx       # Landing page content and sections
├── next.config.ts     # Next.js configuration
├── package.json       # Scripts and dependencies
├── package-lock.json  # Locked dependency tree
└── tsconfig.json      # TypeScript configuration
```

## Running locally

```bash
npm install
npm run dev
```

Open the local development server:

```text
http://localhost:3000
```

If port `3000` is already in use:

```bash
npm run dev -- --port 3001
```

## Build

```bash
npm run build
npm run start
```

## Available scripts

```bash
npm run dev    # Start the Next.js development server
npm run build  # Create a production build
npm run start  # Start the production server after building
npm run lint   # Run linting, when supported by the installed Next.js version
```

## Security and privacy notes

This repository is intentionally public-safe. The landing page avoids publishing:

- internal IP addresses
- private DNS names or service URLs
- credentials, tokens, or secret values
- exact node inventory or hardware identifiers
- private network topology
- sensitive image tags, manifests, or runtime configuration

The goal is to communicate the platform design and engineering practices while keeping the actual homelab implementation private and secure.

## Suggested repository topics

`nextjs`, `react`, `typescript`, `homelab`, `kubernetes`, `gitops`, `platform-engineering`, `observability`, `self-hosted`

## Author

Built and maintained by [Yesid Lopez](https://github.com/yesid-lopez).
