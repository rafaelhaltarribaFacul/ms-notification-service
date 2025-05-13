# ms-notification-service

Microsserviço de notificação em Nest.js + Prisma que consome eventos RabbitMQ, persiste notificações e expõe endpoint HTTP.

## 📋 Pré-requisitos

- **Node.js** v16 ou superior  
- **npm**  
- **Docker** & **Docker Compose**  
- (Opcional) **PgAdmin**  

## ⚙️ Variáveis de ambiente

Na raiz do projeto, crie um arquivo `.env` com:

# conexão Postgres
DATABASE_URL=postgresql://postgres:root@127.0.0.1:5432/notification?schema=public

# conexão RabbitMQ
RABBITMQ_URL=amqp://admin:123456@127.0.0.1:5672

## 🐳 Containers necessários

# PostgreSQL + PgAdmin (opcional)
docker compose -f docker/docker-postgres.yml up -d
Banco em localhost:5432, PgAdmin em localhost:15432 (usuário postgres / root).

# RabbitMQ
docker compose -f docker/docker-rabbit.yml up -d
Broker em localhost:5672, console de gestão em localhost:15672 (usuário admin / 123456).

## 💾 Instalação e setup do Prisma

npm install
npx prisma db push      # sincroniza schema.prisma com o banco
npx prisma generate     # gera o Prisma Client

## 🚀 Rodando em modo desenvolvimento

npm run start:dev
O serviço ficará disponível em http://localhost:3001.

## 🔗 Endpoints disponíveis

### GET /

Retorna status do serviço:

    curl http://localhost:3001/
    # running server

### GET /mail/get

Busca notificações persistidas por usuário:

- **URL:** `http://localhost:3001/mail/get?idUser=10`  
- **Método:** `GET`  
- **Resposta de exemplo:**
      
        [
          {
            "id": "…",
            "idUser": "10",
            "mailDestination": "user@teste.com.br",
            "mailContent": "Número do pedido: 123\nValor do pedido: R$ 456.78",
            "mailType": "orderConfirmation",
            "createdAt": "2025-05-13T…Z"

          },
          {
            "id": "…",
            "idUser": "10",
            "mailDestination": "user@teste.com.br",
            "mailContent": "Número do pedido: 123\nValor do pedido: R$ 456.78",
            "mailType": "paymentConfirmation",
            "createdAt": "2025-05-13T…Z"
          }
        ]


## 📝 Observações

- Consome os eventos register e confirmation da fila notification.  
- Persiste cada notificação no Postgres e faz console.log() simulando envio de e-mail.  
- Teste o fluxo completo disparando /credit-card/send no ms-payment-service e depois /mail/get aqui.  
- Para alterar usuário/senha, edite os arquivos Docker Compose e .env.

## 💻 Commit e GitHub

git add README.md  
git commit -m "Adiciona README com instruções de execução do serviço de notificação"  
git remote add origin https://github.com/SEU_USUARIO/ms-notification-service.git  
git branch -M main  
git push -u origin main
