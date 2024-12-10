# Step 1: Use Node.js Alpine base image
FROM node:alpine

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package.json and package-lock.json for dependencies installation
COPY ./package.json ./package-lock.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the server code
COPY ./ ./

# Step 6: Build the TypeScript files
RUN npm run build

# Step 7: Expose the correct port for your app (3000 for Express + Next.js)
EXPOSE 3001

# Step 8: Start the server
CMD ["npm", "start"]