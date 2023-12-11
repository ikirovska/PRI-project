FROM node:20-slim as base

ARG BACKEND_DOCKER_URL
ENV BACKEND_DOCKER_URL $BACKEND_DOCKER_URL
ARG FRONTEND_DOCKER_PORT
ENV FRONTEND_DOCKER_PORT $FRONTEND_DOCKER_PORT
ENV PORT $FRONTEND_DOCKER_PORT
ENV HOSTNAME "0.0.0.0"

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apt-get install libc6-compat
RUN npm i -g pnpm
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN pnpm i

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm i -g pnpm 

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

RUN pnpm run build

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["pnpm", "start"]