FROM node:20-alpine

# Define diretório de trabalho
WORKDIR /app

# Copia e instala dependências
COPY package*.json ./
RUN npm install -g expo-cli
RUN npm install
RUN npm install -g @expo/ngrok

# Copia o resto do código
COPY . .

# Define variáveis de ambiente
ENV EXPO_NO_INTERACTIVE=1
ENV CI=0
EXPOSE 19000 19001 19002 19006

# Comando para rodar o Expo com túnel
CMD ["npx", "expo", "start", "--tunnel"]
