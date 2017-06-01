FROM node:6.9.0:alpine
WORKDIR /opt
COPY package.json /opt
RUN npm install && npm cache clean
COPY ./ ./opt
EXPOSE 9090 9090
CMD ["npm", "start"]