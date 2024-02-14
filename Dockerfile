FROM node:18

WORKDIR /bot

COPY package.json pnpm-lock.yaml .
RUN npx pnpm@7 install
COPY . .
RUN npx tsc

USER node

CMD [ "node", "dist/index.js"]
