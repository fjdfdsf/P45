# Use an official LTS Node image for better stability
FROM node:20-slim

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Set working directory
WORKDIR /app

# Copy dependency definitions first to leverage Docker caching
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy app source code
COPY . .

# Expose the port your app runs on
EXPOSE 8080

# Start the app
CMD ["node", "index.js"]
