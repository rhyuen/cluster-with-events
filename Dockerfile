FROM node:6.9.0:alpine
COPY package.json ./
RUN npm install
COPY ./ ./
CMD ["npm", "start"]