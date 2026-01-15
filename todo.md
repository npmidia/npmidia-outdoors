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


## Perfil de Usuário
- [x] Adicionar campos de contato no schema (telefone, empresa, CNPJ/CPF)
- [x] Criar rota tRPC para atualizar perfil
- [x] Criar página de perfil do usuário
- [x] Adicionar link de perfil no menu de navegação


## Correções e Melhorias
- [x] Corrigir erro no cadastro de outdoor
- [x] Implementar upload de fotos para outdoors
- [x] Trocar logomarca pela nova versão (logoNPMIDIA-2023.png)


## Sistema de Cadastro por E-mail
- [x] Adicionar campo de senha (hash) no schema de usuários
- [x] Criar rotas tRPC para registro e login por e-mail/senha
- [x] Criar página de Login por e-mail/senha
- [x] Criar página de Cadastro com campos: nome, e-mail, telefone, empresa, senha
- [x] Remover login pelo Manus OAuth
- [x] Atualizar navegação para usar novo sistema de autenticação

## Correções de Bugs
- [x] Corrigir erro quando usuário erra a senha no login

## Melhorias no Painel Admin
- [x] Exibir e-mail e telefone na listagem de usuários
- [x] Exibir e-mail e telefone do cliente na listagem de reservas
