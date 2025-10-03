FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN mkdir -p uploads

RUN npm run build

EXPOSE 3000

# run migration before starting app
CMD ["npm", "run", "start:migrate:prod"]
