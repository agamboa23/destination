FROM node:alpine
WORKDIR '/app'
COPY ./package.json ./
RUN npm install
COPY . .

# building is done

CMD ["npm", "run", "start"] 