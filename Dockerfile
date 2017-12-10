FROM node:9.2-alpine
MAINTAINER petar.koretic@gmail.com

WORKDIR /
COPY . .

RUN npm install --only=production

EXPOSE 3000

CMD ["npm", "start"]
