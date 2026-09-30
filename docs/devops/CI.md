# Continuous integration

GitHub Actions runs on pull requests and pushes to `main` or feature branches. The quality gate installs from the lockfile, rebuilds explicitly approved native dependencies, validates and generates Prisma, and runs TypeScript typecheck, tests and builds. A separate Python job runs deterministic engine tests; the Compose contract job validates local service configuration.
