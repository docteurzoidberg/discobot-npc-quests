FROM node:18-alpine3.16 AS builder

ENV LANG C.UTF-8
ENV EDITOR nano

WORKDIR /app

COPY . .

RUN npm ci \
&& npm run build \
&& rm -rf node_modules

#prod node modules + run register commands
RUN npm ci --omit=dev

FROM builder AS register

ARG BOT_TOKEN
ARG DISCORD_CLIENT_ID
ARG DISCORD_GUILD_ID

ENV LANG C.UTF-8
ENV EDITOR nano
ENV DISCORD_CLIENT_ID=$DISCORD_CLIENT_ID
ENV DISCORD_GUILD_ID=$DISCORD_GUILD_ID
ENV BOT_TOKEN=$BOT_TOKEN

WORKDIR /app

RUN npm run register

FROM builder AS runner

ENV LANG C.UTF-8
ENV EDITOR nano
RUN apk add dumb-init
RUN mkdir /data

# APP dir
WORKDIR /app

# RUN
CMD ["dumb-init", "npm", "start"]