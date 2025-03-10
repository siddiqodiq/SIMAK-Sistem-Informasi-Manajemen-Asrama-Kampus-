# Use the official Node.js Alpine image
FROM node:18-alpine AS base

# Install build dependencies for bcrypt
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Install specific packages (bcrypt, jsonwebtoken, next-auth)
RUN npm install bcrypt jsonwebtoken next-auth

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]