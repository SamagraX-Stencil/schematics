export const dockerfileContent = `# Use an official Node.js runtime as a parent image
FROM node:18.16.1-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

RUN npm i -g @samagra-x/stencil-cli typescript ts-node

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the NestJS application
RUN npm run build

# Expose the port the app runs on
EXPOSE \${APP_PORT}


CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"production\" ]; then npm run start:prod; else npm run start:dev; fi"]
`;
