# WoodPlan Events - Backend 🚀

Este é o servidor backend da WoodPlan Events, desenvolvido com **Node.js** e **Express.js**.

## 🚀 Tecnologias
- **Node.js**: Runtime v20+.
- **Express.js**: Framework web.
- **Supabase JS**: Integração com a base de dados.
- **Nodemailer**: Envio de notificações por email.

## 🛠️ Configuração

### Instalação
```bash
npm install
```

### Variáveis de Ambiente
Crie um ficheiro `.env` na raiz da pasta `backend`:
```env
PORT=3000
SUPABASE_URL=sua_url
SUPABASE_KEY=sua_chave
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_app_password_do_gmail
```

### Iniciar o Servidor
```bash
npm start
```
O servidor ficará disponível em `http://localhost:3000`.

## 🔌 API Endpoints
- `POST /api/bookings`: Cria uma nova reserva e envia notificação por email.
- `GET /api/packs`: (Opcional) Retorna os packs configurados no Supabase.

---
© 2025 WoodPlan Events.
