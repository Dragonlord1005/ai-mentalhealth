FROM node:20-alpine

# Set absolute working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Approve build scripts for dependencies
RUN pnpm approve-builds

# Copy package.json, lockfile, and prisma schema before installation
COPY package.json pnpm-lock.yaml ./ 
COPY prisma ./prisma 

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Expose port 3000
EXPOSE 3000

# Set environment variable
ENV NODE_ENV=production

# Generate Prisma client
RUN pnpm prisma generate

# Start the Fastify server
CMD ["pnpm", "serve"]
