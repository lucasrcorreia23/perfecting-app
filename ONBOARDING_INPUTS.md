# Inputs do Onboarding - Fluxograma

## Etapa 0: Boas-vindas (Não conta como etapa)
**Tipo:** Tela informativa
**Ações:** 
- Começar Agora (vai para Etapa 1)
- Pular e explorar sozinho (vai para dashboard/admin)

---

## Etapa 1: Contexto do Negócio

### Inputs:
1. **Nome da Empresa** (obrigatório)
   - Tipo: Text input
   - Placeholder: "Ex: Acme Tecnologia"

2. **Segmento/Indústria** (obrigatório)
   - Tipo: Select
   - Opções:
     - SaaS / Software
     - Consultoria
     - E-commerce
     - Serviços Financeiros
     - Saúde
     - Educação
     - Indústria / Manufatura
     - Varejo
     - Imobiliário
     - Outro

3. **Tamanho do Time de Vendas**
   - Tipo: Select
   - Opções:
     - 1-5 pessoas
     - 6-20 pessoas
     - 21-50 pessoas
     - 51-200 pessoas
     - Mais de 200 pessoas

4. **Principal Desafio do Time**
   - Tipo: Textarea
   - Placeholder: "Ex: Dificuldade em lidar com objeções de preço..."

5. **Objetivo do Treinamento**
   - Tipo: Textarea (span 2 colunas)
   - Placeholder: "Ex: Aumentar taxa de fechamento em 20%, melhorar qualificação de leads..."

---

## Etapa 2: O Que Você Vende

### Inputs:
1. **Nome do Produto/Serviço** (obrigatório)
   - Tipo: Text input
   - Placeholder: "Ex: CRM Pro, Consultoria de Vendas"

2. **Faixa de Preço**
   - Tipo: Select
   - Opções:
     - Até R$ 1.000
     - R$ 1.000 - R$ 10.000
     - R$ 10.000 - R$ 50.000
     - Acima de R$ 50.000
     - Variável / Sob consulta

3. **Descrição em 1 Frase** (obrigatório)
   - Tipo: Text input (span 2 colunas)
   - Limite: 100 caracteres
   - Placeholder: "Ex: Sistema de gestão que aumenta produtividade em 40%"

4. **Qual Problema Resolve**
   - Tipo: Textarea
   - Placeholder: "Ex: Equipes de vendas perdem tempo com tarefas manuais..."

5. **Proposta de Valor Principal**
   - Tipo: Textarea
   - Placeholder: "Ex: Automatizamos 80% das tarefas repetitivas..."

6. **Botão: Gerar com IA**
   - Tipo: Button (span 2 colunas)
   - Ação: Gera conteúdo com IA (mock)

---

## Etapa 3: Para Quem Você Vende (Buyer Persona)

### Inputs:
1. **Nome do Perfil**
   - Tipo: Text input
   - Placeholder: "Ex: Decisor Corporativo"

2. **Cargo/Função Típica** (obrigatório)
   - Tipo: Text input
   - Placeholder: "Ex: Diretor de Vendas, CEO"

3. **Tamanho da Empresa Alvo**
   - Tipo: Multiple checkbox
   - Opções:
     - Startups
     - Pequenas empresas
     - Médias empresas
     - Grandes empresas

4. **Nível de Conhecimento sobre Soluções**
   - Tipo: Select
   - Opções:
     - Não conhece soluções similares
     - Conhece o problema, busca solução
     - Conhece soluções, compara opções
     - Já conhece nosso produto

5. **Principais Dores** (obrigatório)
   - Tipo: Textarea
   - Placeholder: "Ex: Falta de visibilidade no pipeline..."

6. **Objeções Comuns**
   - Tipo: Textarea
   - Placeholder: "Ex: Preço alto, já tem ferramenta..."

7. **Preview do Agente** (span 2 colunas)
   - Tipo: Card informativo (não é input)
   - Mostra: Avatar + Nome do Perfil + Cargo

---

## Etapa 4: Conteúdo de Treinamento (Opcional)

### Inputs (Tabs):

**Tab 1: Upload**
- Tipo: File upload
- Formatos aceitos: MP4, MOV, AVI
- Limite: 500MB

**Tab 2: Link**
- **URL do Vídeo**
  - Tipo: Text input
  - Placeholder: "https://youtube.com/watch?v=..."
- **Botão: Verificar URL**

**Tab 3: Gravar**
- Tipo: Webcam recording
- Ação: Iniciar Gravação (mock)

### Output:
- Card com sugestões de conteúdo (informativo)

---

## Etapa 5: Resultado Gerado pela IA

**Tipo:** Tela de revisão (geração automática)

### Output (não são inputs):
1. **Trilha de Aprendizagem**
   - Nome da trilha
   - Duração total
   - Módulos (accordion):
     - Ícone + Título + Duração
     - Lista de tópicos

2. **Cenários de Prática** (checkboxes)
   - Tipo de cenário
   - Título
   - Dificuldade
   - Nome do comprador + Cargo
   - Objetivo
   - Checkbox: Incluir ou não

### Ações:
- Gerar Mais (cenários)
- Adicionar Manual

---

## Etapa 6: Adicionar Time (Opcional)

### Inputs:

1. **Email do Membro**
   - Tipo: Text input + Button "Adicionar"
   - Validação: Email válido
   - Lista de emails adicionados (com botão remover)

2. **Importar de CSV**
   - Tipo: Button
   - Ação: Upload CSV (mock)

3. **Permissões** (Checkboxes):
   - Acessar trilhas de aprendizagem
   - Acessar roleplays de prática
   - Criar cenários personalizados

4. **Quando Enviar Convites** (Checkbox):
   - Enviar convites agora

5. **Mensagem Personalizada** (opcional)
   - Tipo: Textarea (span 2 colunas)
   - Placeholder: "Adicione uma mensagem para os convites..."

### Output:
- Card com estimativa do treinamento (informativo):
  - Membros do time
  - Trilhas disponíveis
  - Cenários de prática
  - Duração total

---

## Etapa 7: Conclusão (Revisão Final)

**Tipo:** Tela de revisão completa

### Output (não são inputs):
- Resumo de todos os dados inseridos
- Seções editáveis com botão "Editar" para voltar à etapa específica

### Ações:
- **Salvar Rascunho**
- **Ativar Treinamento** (finaliza onboarding)

---

## Fluxo de Navegação

```
Boas-vindas (0)
    ├─> Começar → Etapa 1
    └─> Pular → Dashboard/Admin

Etapa 1 (Contexto do Negócio)
    ├─> Voltar (não existe)
    └─> Próximo → Etapa 2

Etapa 2 (O Que Você Vende)
    ├─> Voltar → Etapa 1
    └─> Próximo → Etapa 3

Etapa 3 (Buyer Persona)
    ├─> Voltar → Etapa 2
    └─> Próximo → Etapa 4

Etapa 4 (Conteúdo) [OPCIONAL]
    ├─> Voltar → Etapa 3
    ├─> Pular → Etapa 5
    └─> Próximo → Etapa 5

Etapa 5 (Resultado IA)
    ├─> Voltar → Etapa 4
    └─> Próximo → Etapa 6
    (Auto-geração ao entrar na etapa)

Etapa 6 (Time) [OPCIONAL]
    ├─> Voltar → Etapa 5
    ├─> Pular → Etapa 7
    └─> Próximo → Etapa 7

Etapa 7 (Conclusão)
    ├─> Voltar → Etapa 6
    ├─> Salvar Rascunho → Salva no localStorage
    └─> Ativar Treinamento → Finaliza e vai para Dashboard/Admin
```

---

## Validações por Etapa

### Etapa 1:
- ✅ Nome da Empresa preenchido
- ✅ Segmento/Indústria selecionado

### Etapa 2:
- ✅ Nome do Produto preenchido
- ✅ Descrição em 1 Frase preenchida

### Etapa 3:
- ✅ Cargo/Função preenchido
- ✅ Principais Dores preenchidas

### Etapa 4, 5, 6, 7:
- ✅ Sem validações obrigatórias (etapas opcionais ou de revisão)

---

## Dados Salvos no LocalStorage

### Chave: `onboarding_progress`

```json
{
  "step": 3,
  "formData": {
    "business": { ... },
    "product": { ... },
    "buyer": { ... },
    "content": { ... },
    "generatedTrail": { ... },
    "generatedScenarios": [ ... ],
    "team": { ... }
  }
}
```

---

## Indicadores Visuais

### Stepper (tracinhos):
- 7 tracinhos no total (Etapa 1 a 7)
- Posição: Lado direito, alinhado com o título de cada etapa
- Cor: 
  - Azul (#2E63CD) = etapas completadas
  - Cinza (#E5E7EB) = etapas não completadas
- Não aparece na tela de Boas-vindas (Etapa 0)

### Botões de Navegação:
- **Voltar**: Sempre visível (exceto Etapa 1)
- **Salvar e Continuar Depois**: Entre Voltar e Próximo (Etapa 1+)
- **Pular**: Apenas em etapas opcionais (4 e 6)
- **Próximo**: Avança para próxima etapa
- **Ativar Treinamento**: Apenas na Etapa 7 (conclusão)
