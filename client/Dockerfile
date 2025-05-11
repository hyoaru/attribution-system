FROM node:20-alpine
WORKDIR /app

# Install necessary tools
RUN apk add --no-cache curl bash

# Copy package files and installl dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the code
COPY \
  index.html \
  vite.config.ts \
  eslint.config.js \
  components.json \
  postcss.config.js \
  tailwind.config.js \
  tsconfig.json \
  tsconfig.app.json \
  tsconfig.node.json \
  ./

COPY ./public ./public
COPY ./src ./src

# Build the project
CMD ["npm", "run", "build"]
