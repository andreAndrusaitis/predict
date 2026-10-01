FROM node:22-alpine AS build
WORKDIR /app
COPY . .
RUN corepack enable && pnpm install --frozen-lockfile --ignore-scripts && pnpm rebuild esbuild msgpackr-extract
RUN pnpm exec prisma generate --schema prisma/schema.prisma && pnpm --filter @predict/api build
FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/package.json ./apps/api/package.json
ENV NODE_ENV=production
CMD ["node", "apps/api/dist/main.js"]
