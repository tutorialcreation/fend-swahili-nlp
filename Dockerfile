FROM node:8.4.0
RUN npm install -g serve
COPY package.json package.json
RUN npm install
COPY . .
RUN npm run build
CMD serve -p $PORT -s dist
