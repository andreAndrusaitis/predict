FROM node:22-alpine AS build
WORKDIR /app
COPY . .
RUN corepack enable && pnpm install --frozen-lockfile --ignore-scripts && pnpm rebuild esbuild msgpackr-extract && pnpm --filter @predict/web build
FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/web/.next ./apps/web/.next
COPY --from=build /app/apps/web/package.json ./apps/web/package.json
CMD ["node_modules/.bin/next", "start", "apps/web", "-p", "3000"]
