FROM node:alpine
WORKDIR /app
#RUN apk add --no-cache packagenamehere
COPY package.json /app
RUN npm install && npm cache clean
COPY ./ ./app
EXPOSE 9090 9090
RUN addgroup -S app && adduser -S -g app app
RUN chown app -R ./app/node_modules
USER app
CMD ["cross-env", "NODE_ENV=prod", "node", "app/clusterex.js"]