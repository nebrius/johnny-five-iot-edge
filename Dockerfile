FROM node:8-slim
RUN bash npm install johnny-five
RUN bash npm install raspi-io
RUN mkdir src
COPY . /src
WORKDIR /src/examples
RUN node dryrun.js
