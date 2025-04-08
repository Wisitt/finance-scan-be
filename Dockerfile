FROM node:18 AS builder

WORKDIR /app

COPY . .

RUN npm install
RUN npx prisma generate  # สำคัญ!
RUN npm run build

FROM node:18-slim

WORKDIR /app

# ติดตั้ง OpenSSL เพื่อแก้ libssl warning จาก Prisma
RUN apt-get update && apt-get install -y openssl

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 8080

CMD ["node", "dist/main.js"]
