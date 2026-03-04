# Guia de Configuração do Supabase (Storage)

Para que o upload de imagens e vídeos funcione corretamente no Backoffice, é necessário criar 3 "Buckets" no seu painel do Supabase.

## 1. Criar os Buckets
No painel lateral do Supabase (browser):
1.  Clique no ícone de **Storage** (caixa).
2.  Clique no botão **New bucket** e crie os 3 seguintes (respeite as letras minúsculas):
    *   `gallery`
    *   `team-photos`
    *   `testimonials`
3.  **IMPORTANTE**: Para cada um destes buckets, ative a opção **Public bucket** durante a criação.

## 2. Aplicar as Permissões (SQL)
Depois de criar os buckets, precisa de autorizar o site a ler e escrever neles:
1.  Vá ao **SQL Editor** no painel lateral.
2.  Abra o ficheiro [fix_storage_rls.sql](file:///c:/Users/jonny/Desktop/Silkadelics/database/fix_storage_rls.sql) no seu computador.
3.  Copie o conteúdo, cole no SQL Editor do Supabase e clique em **Run**.

---
**Nota**: Se os nomes dos buckets não forem exatamente `gallery`, `team-photos` e `testimonials`, o sistema dará erro de "Bucket not found".
