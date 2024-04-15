# create a dockerfile for keystonejs app

FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Set environment variables
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Install app dependencies
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install

# Bundle app source
COPY . .

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# Build the app
RUN yarn generate-types
RUN yarn migrate:prod
RUN yarn build:prod:docker

# Expose the port the app runs on
EXPOSE 80

# Run the app
CMD [ "yarn", "start:prod:docker" ]