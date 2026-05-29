# Dùng Node.js version 20, bản alpine (nhẹ hơn, chỉ ~50MB)
FROM node:20-alpine

# Tạo folder /app trong container, mọi lệnh sau chạy trong này
WORKDIR /app

# Copy package.json vào trước — để Docker cache dependencies
# Nếu code thay đổi nhưng package.json không đổi, không cần npm install lại
COPY package*.json ./

# Cài dependencies
RUN npm install

# Copy toàn bộ source code vào container
COPY . .

# Báo container sẽ lắng nghe port 3000
EXPOSE 3000

# Lệnh chạy khi container start
CMD ["npx", "tsx", "src/index.ts"]