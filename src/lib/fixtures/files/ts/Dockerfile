FROM node:18.16.1-alpine
# Use an official Node.js runtime as a parent image 

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

RUN npm i -g @nestjs/cli @samagra-x/stencil-cli typescript ts-node

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the NestJS application
RUN npx prisma generate
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

CMD ["npm", "run", "start:dev"]
