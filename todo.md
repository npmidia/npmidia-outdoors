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


## Botão WhatsApp
- [x] Adicionar botão WhatsApp na página Minhas Reservas
- [x] Adicionar botão WhatsApp na página do Carrinho (finalização de compra)


## Melhorias nos Filtros de Pesquisa
- [x] Adicionar filtro de bi-semanas para ver outdoors disponíveis no período
- [x] Melhorar filtro de iluminação com caixas de seleção (com, sem, ambos)


## Melhorias na Interface
- [x] Criar botão "Limpar Filtros" que restaura todos os filtros para o estado inicial

- [x] Substituir logo na página inicial pela imagem dos outdoors

- [x] Implementar seleção múltipla de bi-semanas no filtro de pesquisa

- [x] Corrigir filtro de bi-semanas para funcionar sem login
- [x] Melhorar visual do filtro de bi-semanas (parecido com tela de reserva)


## Melhorias no Dashboard Administrativo
- [x] Faturamento mensal (valor total das reservas aprovadas)
- [x] Reservas pendentes (quantidade aguardando aprovação)
- [x] Clientes ativos (quantidade de clientes com reservas)
- [x] Alerta/destaque para reservas pendentes há mais de 24 horas
- [x] Notificações de reservas em tempo real (atualização automática a cada 30s)

## Ajuda de Bi-semanas
- [x] Adicionar ícone de interrogação (?) nas seções de bi-semanas com modal mostrando tabela de datas

## Gestão Completa de Reservas
- [x] Adicionar campos no schema: número da venda, status da arte, observações, data instalação prevista
- [x] Criar tabela para artes (upload de arquivos com histórico de versões)
- [x] Criar rotas tRPC para gestão de arte e campos de produção
- [x] Implementar tela de detalhes da reserva no admin com todas as seções
- [x] Tornar número da venda obrigatório ao aprovar reserva
- [x] Adicionar upload de arte pelo cliente na área "Minhas Reservas"

## Visualização por Cliente
- [x] Adicionar filtro por cliente na lista de reservas do admin
- [x] Criar página de detalhes do cliente com histórico completo
- [x] Mostrar resumo: total de reservas, valor gasto, reservas ativas/pendentes

## Melhorias no Filtro de Reservas
- [x] Adicionar número da venda no campo de busca das reservas
- [x] Exibir coluna de número da venda na tabela de reservas

## Correções de UX
- [x] Alterar detalhes da reserva para salvar apenas ao clicar em botão Salvar (não a cada digitação)

## Melhorias de Layout Admin
- [x] Sidebar colapsável no desktop (minimiza para ícones)
- [x] Drawer/menu lateral deslizante no mobile
- [x] Corrigir sobreposição da sidebar com conteúdo

## Simplificação da Tabela de Reservas
- [x] Remover colunas de e-mail e telefone da tabela de reservas

## Melhorias em Minhas Reservas (Cliente)
- [x] Exibir bi-semanas compradas com números e datas
- [x] Exibir serviços extras (Papel/Colagem, Lona/Instalação)

## Correção de Bug
- [x] Corrigir exibição das bi-semanas em Minhas Reservas (não está aparecendo)

## Bug Crítico - Bloqueio de Bi-semanas
- [x] Bi-semanas não estão sendo bloqueadas como pendente após reserva
- [x] Bi-semanas não estão sendo bloqueadas após aprovação da reserva

## Limpeza e Filtros
- [x] Limpar registros de reservation_biweeks de reservas negadas/canceladas
- [x] Adicionar filtro por status da arte na lista de reservas do admin

## Bug - Filtro de Outdoors Disponíveis
- [x] Corrigir filtro para exibir apenas outdoors com bi-semanas disponíveis (não reservadas/pendentes)
