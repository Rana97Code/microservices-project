# ---- Base Node Image ----
FROM node:18-alpine

# ---- Create App Directory ----
WORKDIR /usr/src/app

# ---- Copy package.json ----
COPY package*.json ./

# ---- Install Dependencies ----
RUN npm install

# ---- Copy Source ----
COPY . .

# ---- Build the Application ----
RUN npm run build

# ---- Expose Port ----
EXPOSE 3001

# ---- Run the App ----
CMD ["npm", "run", "start:prod"]