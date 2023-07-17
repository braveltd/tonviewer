# Install dependencies only when needed
FROM docker.io/library/node:lts-alpine AS deps

WORKDIR /opt/app
RUN apk update && apk add git
COPY package.json yarn.lock ./

RUN rm -rf node_modules && rm -rf build

RUN yarn cache clean --all
RUN yarn install --force

# Production image, copy all the files and run next
FROM docker.io/library/node:lts-alpine AS runner

ENV NODE_ENV=production
WORKDIR /opt/app
COPY . .

ARG HOST_NAME
ARG TON_API_TOKEN
ARG AUTH_TOKEN_CLIENT
ARG AUTH_TOKEN_SSR
ARG IS_TEST_ONLY

ENV HOST_NAME $HOST_NAME
ENV TON_API_TOKEN $TON_API_TOKEN
ENV IS_TEST_ONLY $IS_TEST_ONLY
ENV AUTH_TOKEN_SSR $AUTH_TOKEN_SSR
ENV AUTH_TOKEN_CLIENT $AUTH_TOKEN_CLIENT

ENV SENTRY_ORG sentry
ENV SENTRY_PROJECT tonapi

ARG SENTRY_ENVIRONMENT
ARG SENTRY_DSN
ARG SENTRY_URL
ARG SENTRY_AUTH_TOKEN

ENV SENTRY_ENVIRONMENT $SENTRY_ENVIRONMENT
ENV SENTRY_DSN $SENTRY_DSN
ENV SENTRY_URL $SENTRY_URL
ENV SENTRY_AUTH_TOKEN $SENTRY_AUTH_TOKEN

COPY --from=deps /opt/app/node_modules ./node_modules
ADD https://raw.githubusercontent.com/tonkeeper/tonapi/master/README.md /opt/app/docs/README.md
ADD https://tonapi.io/swagger.json /opt/app/public/swagger.json
RUN export NODE_OPTIONS='--max-old-space-size=8192'
RUN yarn test
RUN yarn build

ARG X_TAG

CMD ["npm", "run", "start"]

EXPOSE 3000

