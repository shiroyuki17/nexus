FROM node:22-alpine

WORKDIR /app

# Install all dependencies (root + prisma)
COPY package*.json ./
COPY prisma ./prisma

RUN npm install
RUN npx prisma generate

# Copy backend and entitles
COPY backend ./backend
COPY entitles ./entitles

# Copy frontend source and build it
COPY frontend ./frontend

# Install frontend deps and build
RUN cd frontend && npm install && npm run build

# Move built frontend to where backend can serve it
RUN mv frontend/dist ./public

EXPOSE 4000

CMD sh -c "npx prisma db push && node backend/data/seed.js && node backend/server.js"
