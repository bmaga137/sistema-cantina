# CantinaFácil

Aplicação acadêmica para pedidos em uma cantina. O cliente pode criar uma conta, consultar o cardápio, fazer pedidos e acompanhar o status. O administrador pode gerenciar o cardápio e atualizar os pedidos.

O frontend usa React e Vite. A API usa Node.js, Express, SQLite e JWT.

## Rodar localmente

Use Node.js 24 e npm. Execute os comandos a partir da raiz do repositório.

1. Crie `backend/.env` com a variável `JWT_SECRET`. Gere um valor aleatório com:

   ```bash
   node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
   ```

   Salve o valor no formato `JWT_SECRET=valor_gerado`.

2. No primeiro terminal, instale e inicie o backend:

   ```bash
   cd backend
   npm ci
   npm run dev
   ```

3. Em outro terminal, instale e inicie o frontend:

   ```bash
   cd frontend
   npm ci
   npm run dev
   ```

Abra [localhost:5173](http://localhost:5173). O frontend encaminha as chamadas da API para a porta `3000`. O backend cria o banco local em `backend/database/cantina.db`.

### Criar uma conta de administrador

Adicione `ADMIN_NAME`, `ADMIN_EMAIL` e `ADMIN_PASSWORD` ao arquivo `backend/.env`. Escolha um e-mail ainda não cadastrado e uma senha com pelo menos oito caracteres. Na pasta `backend`, rode:

```bash
node src/scripts/createAdmin.js
```

Entre pelo mesmo formulário de login. Contas criadas pelo botão **Criar conta** têm perfil de cliente.

## Publicar no Railway

1. Envie os arquivos do projeto ao GitHub. No Railway, crie um serviço a partir do repositório e use a raiz dele como diretório do serviço. O Railway detecta o `Dockerfile` e gera o build do React. O Express serve a interface e a API no mesmo domínio.
2. Anexe um **Volume** ao serviço com caminho de montagem `/data` e mantenha uma réplica. A aplicação usa `RAILWAY_VOLUME_MOUNT_PATH` para salvar o SQLite no volume. O primeiro deploy com um volume vazio começa com cardápio e contas vazios. Os dados criados ali persistem entre deploys enquanto o volume for mantido.
3. Em **Variables**, configure um `JWT_SECRET` próprio para o ambiente publicado. O servidor lê a porta fornecida em `PORT` pelo Railway.
4. Faça o deploy. Em **Settings → Networking → Public Networking**, clique em **Generate Domain** e abra o endereço gerado.
5. Para criar o administrador publicado, configure temporariamente `ADMIN_NAME`, `ADMIN_EMAIL` e `ADMIN_PASSWORD` no serviço e aplique as mudanças. Com a CLI do Railway autenticada e vinculada ao projeto e ao serviço, rode:

   ```bash
   railway ssh node /app/backend/src/scripts/createAdmin.js
   ```

   Após a confirmação da criação, remova as três variáveis `ADMIN_*` do serviço e mantenha `JWT_SECRET`.

O `.env` e o banco de dados local ficam fora do Git. Consulte a documentação do Railway sobre [Dockerfiles](https://docs.railway.com/builds/dockerfiles), [volumes](https://docs.railway.com/volumes), [domínios públicos](https://docs.railway.com/networking/public-networking) e [SSH](https://docs.railway.com/cli/ssh).
