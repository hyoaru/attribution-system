FROM node:20-alpine

# Install necessary tools
RUN apk add --no-cache curl bash

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install

# Copy the rest of the code
COPY . .

# Build the TypeScript project
RUN npm run build

# Start the application in production mode
CMD ["npm", "run", "start"]
