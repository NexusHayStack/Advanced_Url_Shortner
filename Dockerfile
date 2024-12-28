# Use official Node.js image
FROM node:16

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app's code
COPY . .

# Expose the app's port
EXPOSE 5000

# Command to start the app
CMD ["npm", "start"]
