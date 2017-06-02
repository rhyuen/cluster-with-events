FROM node:alpine
WORKDIR /
#RUN apk add --no-cache packagenamehere
COPY package.json /
RUN npm install && npm cache clean --force
COPY ./ ./
EXPOSE 9090 9090
RUN addgroup -S app && adduser -S -g app app
RUN chown app -R /node_modules
RUN chown app /events.txt
USER app
CMD ["npm", "start"]
