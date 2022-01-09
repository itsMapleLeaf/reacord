FROM node:lts-slim

WORKDIR /app

COPY / ./
RUN ls -R

RUN npm install -g pnpm
RUN pnpm install --unsafe-perm --frozen-lockfile
RUN pnpm build -C packages/docs
RUN pnpm install --prod --unsafe-perm --frozen-lockfile

CMD [ "pnpm", "start", "-C", "packages/docs" ]
