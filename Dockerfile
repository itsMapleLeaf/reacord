FROM node:lts-slim

ENV CYPRESS_INSTALL_BINARY=0

WORKDIR /app

COPY / ./
RUN ls -R

RUN npm install -g pnpm
RUN pnpm install --unsafe-perm --frozen-lockfile
RUN pnpm run build -C packages/docs

ENV NODE_ENV=production
CMD [ "pnpm", "-C", "packages/docs", "start" ]
