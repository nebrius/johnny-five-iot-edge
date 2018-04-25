FROM arm64v8/node:8-alpine
RUN npm install johnny-five
RUN npm install raspi-io
RUN mkdir src
COPY . /src
WORKDIR /src/examples
RUN node dryrun.js
