# Gunakan Node.js Alpine yang ringan
FROM node:18-alpine AS base

# Install build dependencies hanya jika menggunakan bcrypt
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package.json dan package-lock.json
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Install tambahan package yang diperlukan
#RUN npm install jsonwebtoken next-auth

# Copy seluruh kode aplikasi ke dalam container
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port aplikasi
EXPOSE 3000

# Jalankan aplikasi
CMD ["npm", "run", "dev"]
