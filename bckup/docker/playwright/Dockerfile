FROM mcr.microsoft.com/playwright:v1.23.1-focal as playwright

ARG ATACCAMA_ONE_TELLSTORY_WEBAPP_WIDGET_HASH
ARG ATACCAMA_ONE_TELLSTORY_WEBAPP_APP_BASE_URL

ENV NODE_ENV=testing \
		PLAYWRIGHT_BROWSERS_PATH=/app/browsers \
		PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
		ATACCAMA_ONE_TELLSTORY_WEBAPP_WIDGET_HASH=${ATACCAMA_ONE_TELLSTORY_WEBAPP_WIDGET_HASH} \
		ATACCAMA_ONE_TELLSTORY_WEBAPP_APP_BASE_URL=${ATACCAMA_ONE_TELLSTORY_WEBAPP_APP_BASE_URL} \
		# mock necessary env vars for Nginx to run (made up config file as we're mocking everything)
		# TODO: move this elsewhere in the future, without hardcoding staging defaults
		ATACCAMA_ONE_TELLSTORY_WEBAPP_API_BASE_URL="https://tellstory-platform.env.staging.tellstory.cloud" \
		ATACCAMA_ONE_TELLSTORY_WEBAPP_AUTH_KEYCLOAK_REALM="ataccamaone" \
		ATACCAMA_ONE_TELLSTORY_WEBAPP_AUTH_KEYCLOAK_URL="https://env.staging.tellstory.cloud/auth" \
		ATACCAMA_ONE_TELLSTORY_WEBAPP_AUTH_KEYCLOAK_CLIENT_ID="tellstory-webapp-public-client"

# Install dependencies
RUN set -eux; \
    apt-get update; \
    apt-get install --no-install-recommends --no-install-suggests -y \
    	nginx \
    	jq \
    	g++ \
    	make \
    	gettext \
    ; \
    apt-get remove --purge --auto-remove -y && rm -rf /var/lib/apt/lists/*; \
    mkdir /docker-entrypoint.d;

# Copy init scripts from Nginx image
COPY --from=harbor.ataccama.dev/cache/library/nginx:1.23.0 /docker-entrypoint.sh /
COPY --from=harbor.ataccama.dev/cache/library/nginx:1.23.0 /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh /docker-entrypoint.d
COPY --from=harbor.ataccama.dev/cache/library/nginx:1.23.0 /docker-entrypoint.d/20-envsubst-on-templates.sh /docker-entrypoint.d
COPY --from=harbor.ataccama.dev/cache/library/nginx:1.23.0 /docker-entrypoint.d/30-tune-worker-processes.sh /docker-entrypoint.d

# Build the assets (in testing mode)
WORKDIR /app

COPY package.json yarn.lock .npmrc /app/
RUN yarn

COPY public /app/public/
COPY src /app/src/
COPY .browserslistrc \
     .editorconfig \
     .eslintignore \
     .eslintrc.js \
     .gitignore \
     .prettierrc \
     custom.scss \
     jsconfig.json \
     README.md \
     index.html \
     tsconfig.json \
     vue.config.js \
     vite.config.ts \
     /app/
RUN yarn build

# Copy over static assets built in the previous stage (to serve them via Nginx)
RUN cp -r /app/dist/. /var/www/html/
COPY docker/prod/nginx.conf.template /etc/nginx/conf.d/default.conf.template
COPY docker/prod/entrypoint.sh /docker-entrypoint.d/40-tellstory-entrypoint.sh

# Fixes
RUN set -eux; \
    # /bin/ash -> /bin/bash (as we're not running on alpine)
    sed -i "1 s/ash/bash/" /docker-entrypoint.d/40-tellstory-entrypoint.sh; \
    # standardize dev/testing ports to 8080 \
    # sed -i "s/listen 80/listen 8080/" /etc/nginx/conf.d/default.conf.template \
    # remove default site config from Nginx (as we're supplying our own)
    rm /etc/nginx/sites-enabled/default;

# Install browser(s)
COPY playwright.config.ts /app/
RUN mkdir /app/browsers && npx playwright install --with-deps chromium
