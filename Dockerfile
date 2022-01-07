FROM node:lts-slim

WORKDIR /app

COPY / ./
RUN ls -R

RUN npm install -g pnpm
RUN pnpm install --prod --unsafe-perm --frozen-lockfile

CMD [ "pnpm", "-C", "packages/docs", "start" ]
