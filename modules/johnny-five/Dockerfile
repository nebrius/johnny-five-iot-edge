FROM resin/rpi-raspbian

WORKDIR .

RUN apt update

RUN apt install -y pigpio npm git build-essential

RUN npm install -g n

RUN n 8.9.4

COPY package*.json ./

RUN npm install --production

COPY . .

CMD ["sh", "-c", "node $DEBUG_OPTION app.js"]
