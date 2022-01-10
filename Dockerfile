FROM node:lts-slim

ENV NODE_ENV=production
ENV CYPRESS_INSTALL_BINARY=0

WORKDIR /app

COPY / ./
RUN ls -R

RUN npm install -g pnpm
RUN pnpm install --unsafe-perm --frozen-lockfile
RUN pnpm run build -C packages/docs

CMD [ "pnpm", "-C", "packages/docs", "start" ]
