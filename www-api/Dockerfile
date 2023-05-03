FROM node:18-alpine3.16

# Packages
RUN apk add dumb-init

# ENV
ENV NODE_ENV production
ENV LANG C.UTF-8
ENV EDITOR nano
ENV DATA_PATH /data

# Data volume
RUN mkdir /data 

# App directory
WORKDIR /app

# First dependencies. for cache
COPY package*.json ./

RUN npm install --omit=dev        
RUN npm install -g pino-pretty

# Then app source
COPY . .

EXPOSE 5000

CMD ["dumb-init", "npm", "run", "start"]
