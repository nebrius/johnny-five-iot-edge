FROM resin/rpi-raspbian

WORKDIR .

RUN apt update

RUN apt install -y pigpio npm git build-essential

RUN npm install -g n

RUN n 8.9.4

COPY . .

RUN npm install --production

CMD ["sh", "-c", "node app.js"]
