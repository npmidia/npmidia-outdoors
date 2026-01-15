# NPMIDIA Outdoors - TODO

## Configuração Inicial
- [x] Identidade visual (cores, logo, tema)
- [x] Schema do banco de dados (users, outdoors, reservas, bi-semanas, favoritos, carrinho)
- [x] Rotas tRPC (públicas e protegidas)

## Páginas Públicas
- [x] Página de boas-vindas com logo e CTAs
- [x] Galeria de outdoors com filtros (localização, iluminação, disponibilidade)
- [x] Cards de outdoor (foto, código, localização, iluminação, botão Reservar)

## Sistema de Reservas
- [x] Tela de reserva com foto e mapa do outdoor
- [x] Calendário de bi-semanas com status visuais (Liberada/verde, Pendente/amarelo, Bloqueada/vermelho, Fora de validade/cinza)
- [x] Seleção múltipla de bi-semanas
- [x] Cálculo automático de valores
- [x] Serviços adicionais (Papel e Colagem R$350, Lona e Instalação R$1.500)

## Carrinho de Compras
- [x] Adicionar múltiplos outdoors ao carrinho
- [x] Exibir resumo com valores
- [x] Confirmação de pedido

## Painel do Cliente
- [x] Minhas Reservas (histórico e status)
- [x] Favoritos (marcar/desmarcar outdoors)

## Painel Administrativo
- [x] CRUD de outdoors (código, fotos, endereço, lat/lng, tamanho, valor, iluminação, data ativação, status)
- [x] Gestão de reservas (listar, filtrar, aprovar/negar)
- [x] Gestão de usuários (criar, editar, alterar perfil)
- [x] Notificações de novas reservas
- [x] Geração automática de calendário de bi-semanas

## Autenticação
- [x] Sistema de roles (admin/user)
- [x] Proteção de rotas por perfil
