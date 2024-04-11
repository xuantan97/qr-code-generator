# Base image with Node.js 16 (adjust as needed)
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the application script
COPY index.js .

# Expose the port
EXPOSE 5000

# Start the Node.js application (adjust for script name)
CMD [ "node", "index.js" ]
