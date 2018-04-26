FROM resin/rpi-raspbian

WORKDIR .

COPY package*.json ./

RUN apt update

RUN apt install -y pigpio npm git build-essential

RUN npm install -g n

RUN n 8.9.4

RUN npm install --production

COPY app.js ./

ENV DEBUG_OPTION " "

CMD ["sh", "-c", "node $DEBUG_OPTION app.js"]
