# Define image FROM
FROM node:10

# Create app directory WORKDIR
WORKDIR /app

# Enviroment ENV
ENV PATH /app/node_modules/.bin:$PATH

# Bundle app source COPY
COPY package.json /app/package.json

# Install dependencies
RUN npm install && \
    npm i bcryptjs && \
    npm i @types/bcryptjs

# Listening ports EXPOSE
EXPOSE 8080

# Default command on container run CMD (overwritted) / ENTRYPOINT
CMD [ "npm", "run", "dev" ]
