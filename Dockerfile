FROM node:16-slim

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --include=dev

COPY tsconfig.json nodemon.json /app/

COPY src /app/src

EXPOSE 3000

CMD [ "yarn", "dev" ]
