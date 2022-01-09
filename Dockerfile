FROM node:lts-slim

WORKDIR /app

COPY / ./
RUN ls -R

RUN npm install -g pnpm
RUN pnpm install --unsafe-perm --frozen-lockfile
RUN pnpm run build -C packages/docs
RUN pnpm install -C packages/docs --prod --unsafe-perm --frozen-lockfile
RUN pnpm store prune

CMD [ "pnpm", "start", "-C", "packages/docs" ]
