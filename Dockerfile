# Gunakan Node.js sebagai base image
FROM node:18-alpine

# Set working directory di dalam container
WORKDIR /app

# Copy package.json dan package-lock.json, lalu install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy seluruh kode proyek
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose port 3000 untuk Next.js
EXPOSE 3000

# Jalankan aplikasi
CMD ["npm", "run", "dev"]
