# Agenda de Servicos

Aplicacao React (Vite) para vitrine de servicos com agendamento por horario:

- listagem com filtros e busca
- detalhe do servico com data e horario livres
- envio direto para WhatsApp com resumo

## Stack

- React 19
- React Router
- CSS por feature (sem Tailwind)
- Vite

## Scripts

- `npm run dev`: inicia o frontend
- `npm run api`: sobe API fake local em `http://localhost:3000`
- `npm run dev:full`: sobe API fake + frontend juntos
- `npm run build`: build de producao
- `npm run lint`: validacao de lint
- `npm run preview`: preview local da build

## Rotas da aplicacao

- `/` ou `/servicos`: catalogo principal
- `/servicos/:productId`: detalhe de servico e horario

## Configuracao da marca

Troque nome e logo do cliente em:

- `src/app/brand.js`

Exemplo:

- `name`: nome exibido no topo das telas
- `logo`: caminho da imagem em `public/` (exemplo: `/logo-cliente.svg`)

## Servicos e fotos

Dados dos servicos:

- `src/features/catalog/data/products.js`

Arquivos de imagem:

- `public/products/`

Cada item usa o campo `image`, por exemplo:

- `/products/pulse-headset.svg`

## Confirmacao por WhatsApp

No detalhe do servico, o botao "Solicitar no WhatsApp" abre o WhatsApp com resumo da solicitacao.

Variavel recomendada:

- `VITE_WHATSAPP_SELLER=5511999999999`

Defina em arquivo `.env` para desenvolvimento e em Environment Variables no Vercel para producao.

## Camada de servico e fallback

Servico do catalogo:

- `src/features/catalog/services/catalogService.js`

Comportamento:

- Se `VITE_API_BASE_URL` existir e a API responder, usa dados remotos
- Se a API falhar ou estiver offline, cai automaticamente para dados locais (`products.js`)

## API fake opcional

Base local:

- `db.json`

Endpoints:

- `GET /products`
- `GET /products/:id`

## Deploy no Vercel

Passo a passo rapido:

1. Importar o repositorio no Vercel
2. Framework: Vite
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Configurar variaveis de ambiente (principalmente `VITE_WHATSAPP_SELLER`)
6. Deploy

## Estrutura principal

- `src/app/`: configuracoes globais e rotas
- `src/features/catalog/`: listagem, detalhe, filtros e servico
- `public/products/`: imagens dos itens
