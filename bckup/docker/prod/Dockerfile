FROM harbor.ataccama.dev/cache/library/node:19-alpine as builder

WORKDIR /opt/app

RUN apk add --no-cache python3 make=4.3-r1 g++=12.2.1_git20220924-r4

COPY package.json /opt/app/
COPY yarn.lock /opt/app/
COPY .npmrc /opt/app/

RUN yarn


COPY public /opt/app/public/
COPY src /opt/app/src/
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
     /opt/app/

ARG ATACCAMA_ONE_TELLSTORY_WEBAPP_WIDGET_HASH
ENV ATACCAMA_ONE_TELLSTORY_WEBAPP_WIDGET_HASH=${ATACCAMA_ONE_TELLSTORY_WEBAPP_WIDGET_HASH}
ARG ATACCAMA_ONE_TELLSTORY_WEBAPP_APP_BASE_URL
ENV ATACCAMA_ONE_TELLSTORY_WEBAPP_APP_BASE_URL=${ATACCAMA_ONE_TELLSTORY_WEBAPP_APP_BASE_URL}


RUN yarn lint && yarn run build --base=${ATACCAMA_ONE_TELLSTORY_WEBAPP_APP_BASE_URL}

# "bake in" the distribution information
ARG BUILD_ID
ENV ATACCAMA_ONE_TELLSTORY_BUILD_ID=${BUILD_ID:-latest}
ARG CI_COMMIT_SHA
ENV ATACCAMA_ONE_TELLSTORY_COMMIT_ID=${CI_COMMIT_SHA:-000000}

FROM harbor.ataccama.dev/cache/library/nginx:alpine

ARG ATACCAMA_ONE_TELLSTORY_WEBAPP_WIDGET_HASH
ENV ATACCAMA_ONE_TELLSTORY_WEBAPP_WIDGET_HASH=${ATACCAMA_ONE_TELLSTORY_WEBAPP_WIDGET_HASH}
ARG ATACCAMA_ONE_TELLSTORY_WEBAPP_APP_BASE_URL
ENV ATACCAMA_ONE_TELLSTORY_WEBAPP_APP_BASE_URL=${ATACCAMA_ONE_TELLSTORY_WEBAPP_APP_BASE_URL}


RUN apk add --no-cache jq=1.6-r2

COPY --from=builder /opt/app/dist /var/www/html
COPY docker/prod/nginx.conf.template /etc/nginx/conf.d/default.conf.template
COPY docker/prod/entrypoint.sh /docker-entrypoint.d/40-tellstory-entrypoint.sh

# "bake in" the distribution information
ARG BUILD_ID
ENV ATACCAMA_ONE_TELLSTORY_BUILD_ID=${BUILD_ID:-latest}
ARG CI_COMMIT_SHA
ENV ATACCAMA_ONE_TELLSTORY_COMMIT_ID=${CI_COMMIT_SHA:-000000}
