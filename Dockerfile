# -- Build stage --
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY tsconfig.json ./
COPY src/ ./src/
RUN npx tsc

# -- Runtime stage --
FROM node:22-alpine
WORKDIR /app

LABEL org.opencontainers.image.title="Codepliant" \
      org.opencontainers.image.description="Scan your codebase, generate compliance documents. Privacy Policy, Terms of Service, AI Disclosure, Cookie Policy, DPA — all from your actual code." \
      org.opencontainers.image.url="https://github.com/joechensmartz/codepliant" \
      org.opencontainers.image.source="https://github.com/joechensmartz/codepliant" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.vendor="Codepliant"

COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./

# Install production dependencies only (MCP SDK)
COPY --from=build /app/package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts 2>/dev/null || true

ENTRYPOINT ["node", "dist/cli.js"]
