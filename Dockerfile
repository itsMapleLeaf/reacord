FROM node:lts-slim

WORKDIR /app

COPY / ./
RUN ls -R

RUN npm install -g pnpm
RUN pnpm install --unsafe-perm --frozen-lockfile

RUN pnpm -C packages/docs build

CMD [ "pnpm", "-C", "packages/docs", "start" ]
