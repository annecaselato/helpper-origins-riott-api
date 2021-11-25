# Define image FROM
FROM node:10

# Create app directory WORKDIR
WORKDIR /app

# Enviroment ENV
ENV PATH /app/node_modules/.bin:$PATH

# Bundle app source COPY
COPY package.json /app/package.json

# Install dependencies
RUN npm i bcryptjs
RUN npm i -D @types/bcryptjs
RUN npm i jsonwebtoken
RUN npm i -D @types/jsonwebtoken
RUN npm install

# Listening ports EXPOSE
EXPOSE 8080

# Default command on container run CMD (overwritted) / ENTRYPOINT
CMD [ "npm", "run", "dev" ]
