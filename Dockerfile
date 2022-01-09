FROM node:lts-slim

WORKDIR /app

COPY / ./
RUN ls -R

RUN npm install -g pnpm
RUN pnpm install --unsafe-perm --frozen-lockfile
RUN pnpm run build -C packages/docs

ENV NODE_ENV=production
CMD [ "pnpm", "-C", "packages/docs", "start" ]
