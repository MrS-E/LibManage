# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=16.14.2
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="NodeJS"

# NodeJS app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV=production


# Throw-away build stage to reduce size of final imaged

# Install node modules
COPY package.json /app
RUN npm install

# Copy application code
COPY . /app

# Start the server by default, this can be overwritten at runtime
CMD [ "npm", "run", "start" ]
