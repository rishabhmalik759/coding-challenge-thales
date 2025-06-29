FROM node:18-alpine AS base
WORKDIR /usr/src/app

# ---- Dependencies Stage ----
FROM base AS dependencies
COPY package*.json ./
RUN npm install

# ---- Build Stage ----
FROM dependencies AS build
COPY . .
RUN npm run build

# ---- Production Stage ----
FROM base AS production
ENV NODE_ENV=production

COPY --from=build /usr/src/app/dist ./dist

COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=dependencies /usr/src/app/package*.json ./

# Expose the port the app runs on (default is 3000)
EXPOSE 3000

# The command to run the application
CMD ["node", "dist/main"]