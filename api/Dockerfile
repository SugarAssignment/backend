FROM ghcr.io/puppeteer/puppeteer:20.5.0

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
        PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/sugarwallet/backend

COPY ./package.json ./

RUN npm i

COPY . .

CMD [ "node", "server.js" ]
