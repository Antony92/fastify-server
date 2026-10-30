# ----------------------------------------------------
# 1. Base stage
# ----------------------------------------------------
FROM node:26-alpine AS base
WORKDIR /app

# Build-time argument with a default fallback to 8080
ARG SERVER_PORT=8080
# Runtime environment variable initialized to the build arg
ENV SERVER_PORT=${SERVER_PORT}

# ----------------------------------------------------
# 2. Dependencies & Build stage
# ----------------------------------------------------
FROM base AS builder
COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
# Add other directories if needed by compilation (e.g., templates)
RUN npm run build

# ----------------------------------------------------
# 3. Production Runner stage
# ----------------------------------------------------
FROM base AS runner
ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled JavaScript output
COPY --from=builder /app/dist ./dist

# Copy static files
COPY src/templates ./dist/templates
COPY src/public ./dist/public
COPY drizzle ./drizzle

EXPOSE ${SERVER_PORT}

# Runs the compiled entry point (matches "main": "dist/app.js")
CMD ["node", "dist/app.js"]
