# WoodPlan Events - Guia de Arranque 🚀

Este projeto consiste num website de luxo para uma banda de covers, construído com **Angular 19**, **TailwindCSS 4**, **Node.js** e **Supabase**.

## ✨ Novas Funcionalidades
- **Design de Luxo**: Estética premium com fontes elegantes e animações suaves.
- **Backoffice**: Área de administração para gestão da galeria e vídeo promocional.
- **Notificações por Email**: Alertas automáticos para novos pedidos de reserva.
- **Internacionalização**: Suporte completo para Português e Inglês.

---

## 🛠️ Como Iniciar o Projeto

### 1. Configuração da Base de Dados (Supabase)
1. Crie um projeto no [Supabase](https://supabase.com/).
2. Vá ao **SQL Editor** e execute o conteúdo do ficheiro `supabase_schema.sql`.
3. Crie um **Storage Bucket** chamado `gallery` e defina-o como público.
4. Obtenha o seu `SUPABASE_URL` e `SUPABASE_ANON_KEY` nas definições do projeto.

### 2. Iniciar o Backend (API)
O backend lida com as reservas e o envio de emails.
1. Abra um terminal na pasta `backend`.
2. Instale as dependências: `npm install`.
3. Configure o ficheiro `.env`:
   ```env
   PORT=3000
   SUPABASE_URL=sua_url
   SUPABASE_KEY=sua_chave
   EMAIL_USER=seu_email@gmail.com
   EMAIL_PASS=sua_app_password_do_gmail
   ```
4. Inicie o servidor: `npm start`.

### 3. Iniciar o Frontend (Website)
1. Abra um terminal na pasta `frontend`.
2. Instale as dependências: `npm install`.
3. Configure o ficheiro `src/app/core/config/supabase.config.ts` com as suas credenciais.
4. Inicie o servidor: `npm start`.
   - O site estará em `http://localhost:4200`.
   - O backoffice estará em `http://localhost:4200/admin`.

---

## 📂 Estrutura do Projeto
- `/frontend`: Aplicação Angular 19 + Tailwind 4.
- `/backend`: Servidor Express.js + Nodemailer.
- `supabase_schema.sql`: Script SQL para tabelas e políticas RLS.
- `start.bat`: Script para iniciar tudo automaticamente (Windows).

## 🔐 Acesso ao Backoffice
Para aceder ao backoffice em `/admin`, deve criar um utilizador no Supabase Auth (Email/Password). Após o login, poderá:
- Fazer upload de fotos e vídeos para a galeria.
- Alterar o vídeo promocional da página inicial.
- Gerir os pedidos de reserva (em breve).

---
© 2025 WoodPlan Events. Todos os direitos reservados.
