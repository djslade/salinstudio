FROM node:22-alpine

# Install Perl for exiftool
RUN apk add --no-cache perl

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

# Start the server using the production build
CMD ["npm", "run", "start:prod"]