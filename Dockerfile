# Playwright + TypeScript test framework — containerised runner.
#
# Uses the official Playwright image (free), which ships the matching browser
# binaries and OS dependencies, so no `playwright install` step is needed. The
# image tag is pinned to the Playwright version in package.json (1.60.0).
FROM mcr.microsoft.com/playwright:v1.60.0-jammy

WORKDIR /app

# Install dependencies first to leverage Docker layer caching.
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the project.
COPY . .

# The mock app is started automatically by Playwright's `webServer` config on
# localhost:3000 inside the container. NODE_OPTIONS is set by the npm scripts
# via cross-env, so it is not needed here.
ENV CI=true \
    BASE_URL=http://localhost:3000 \
    API_BASE_URL=http://localhost:3000/api/v1 \
    API_TOKEN=mock-jwt-token-12345

# Default: run the standard suite on Chromium (functional, a11y, security and
# API). @external, @visual and @performance are excluded; generate visual
# baselines with `npm run test:visual:update`.
CMD ["npm", "test"]
