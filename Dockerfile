FROM node:18-slim

WORKDIR /app

COPY package.json yarn.lock ./

RUN apt-get update -y && apt-get install -y openssl

RUN yarn install --frozen-lockfile --include=dev

COPY tsconfig.json nodemon.json jest.config.ts /app/

COPY prisma /app/prisma/

COPY tests /app/tests/

RUN npx prisma generate

COPY src /app/src

EXPOSE 3000

CMD [ "yarn", "dev" ]
