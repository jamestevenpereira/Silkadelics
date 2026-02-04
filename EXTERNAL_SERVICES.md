# Serviços Externos e Infraestrutura - Silkadelics

Este documento descreve as dependências externas, hospedagem e serviços utilizados no projeto.

## 1. Backend (Servidor)
- **Tecnologia**: Node.js com Express.js.
- **Porta Padrão**: 3000.
- **Hospedagem Recomendada**: Render, Heroku ou DigitalOcean.
- **Variáveis de Ambiente**: Localizadas em `/backend/.env` (NÃO comitadas no Git).

## 2. Base de Dados & Storage (Supabase)
- **Plataforma**: [Supabase](https://supabase.com/)
- **URL do Projeto**: `https://rcwbduvulhrsprxhuulq.supabase.co`
- **Serviços Ativos**:
  - **PostgreSQL**: Armazenamento de reservas, packs, repertório, etc.
  - **Authentication**: Gestão de acessos ao Backoffice (Admin).
  - **Storage**: Armazenamento de imagens (logo, membros da equipa, etc.).

## 3. Frontend (Web App)
- **Framework**: Angular 19.
- **Estilo**: TailwindCSS 4.
- **Hospedagem Recomendada**: Netlify, Vercel ou Firebase Hosting.
- **Build Command**: `npm run build` (Gera ficheiros em `/frontend/dist/frontend`).

## 4. Comunicações (Email)
- **Serviço**: Gmail SMTP.
- **Conta**: `woodplancontact@gmail.com`
- **Configuração**: Utiliza "App Passwords" do Google para autenticação segura no backend via `nodemailer`.

## 5. Integrações Externas
- **WhatsApp**: Botão de chat flutuante integrado no frontend.
- **Lucide Icons**: Biblioteca de ícones no frontend.

---
> [!IMPORTANT]
> Nunca partilhe ou comite o ficheiro `.env` ou ficheiros de chaves privadas no repositório Git. Utilize o ficheiro `.env.example` como referência para novos ambientes.
