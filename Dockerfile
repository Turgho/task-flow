# ===============================================
# Estágio de Desenvolvimento (para hot-reload)
# ===============================================
FROM node:22-alpine AS development

WORKDIR /app

# Instala dependências de build
RUN apk add --no-cache git python3 make g++

# Copia arquivos de dependência primeiro (cache otimizado)
COPY package*.json ./
COPY tsconfig*.json ./

# Instala todas as dependências (incluindo devDependencies)
RUN npm ci

# Copia o restante do código
COPY . .

# Porta exposta para desenvolvimento
EXPOSE 3000

# Comando para desenvolvimento com hot-reload
CMD ["npm", "run", "start:dev"]

# ===============================================
# Estágio de Build (para produção)
# ===============================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copia os mesmos arquivos do estágio development
COPY package*.json ./
COPY tsconfig*.json ./

# Instala apenas dependências de produção
RUN npm ci --only=production

# Copia e constrói a aplicação
COPY . .
RUN npm run build

# ===============================================
# Estágio de Produção (final)
# ===============================================
FROM node:22-alpine AS production

WORKDIR /app

# Copia apenas o necessário do estágio builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Configurações de produção
ENV NODE_ENV=production

# Limpeza final
RUN npm prune --production

# Porta e comando
EXPOSE 3000
CMD ["node", "dist/main.js"]