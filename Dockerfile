FROM node:iron-alpine as Builder

ARG ENVIRONMENT
ENV ENVIRONMENT $ENVIRONMENT

WORKDIR /app
ADD package.json ./
ADD yarn.* ./

RUN yarn install

COPY . ./

RUN yarn build:${ENVIRONMENT}
RUN rm -rf .env.*

FROM node:iron-alpine

WORKDIR /app

# 設定ファイルの取得
ADD package.json ./
ADD nuxt.config.ts ./

# ビルド結果の必要なものを取得
COPY --from=Builder /app/.env ./.env
COPY --from=Builder /app/.nuxt ./.nuxt/
COPY --from=Builder /app/node_modules ./node_modules/
COPY --from=Builder /app/public ./public/
COPY --from=Builder /app/server ./server/
COPY --from=Builder /app/.output ./.output/

ENV HOST 0.0.0.0
EXPOSE 3000

CMD node .output/server/index.mjs
