# Perfecting SaaS - Design Guidelines

Este documento define os padroes visuais e diretrizes de design da plataforma.

---

## IMPORTANTE: Regras de Componentes HeroUI

**NAO MODIFIQUE** os estilos de componentes HeroUI definidos em `globals.css`.

Os overrides estao na secao `HEROUI COMPONENT OVERRIDES` e garantem:
- Inputs com fundo branco e borda cinza
- Selects/Dropdowns com estilo consistente
- Listbox/Options com hover e selecao corretos
- Modais, popovers e tooltips padronizados

Se precisar customizar um componente especifico, use `className` no componente React, NAO altere os estilos globais.

---

## Grid System

- **Base:** 8px
- Todos os espacamentos devem ser multiplos de 8: `8, 16, 24, 32, 40, 48, 64, 80, 96`

---

## Paleta de Cores

### Cores Principais (Regra 60-30-10)

| Categoria | Cor | Hex | Uso |
|-----------|-----|-----|-----|
| **60% - Neutro Claro** | Background Primary | `#FAFAFA` | Fundo da aplicacao |
| | Background Secondary | `#F5F5F5` | Areas secundarias |
| | Surface | `#FFFFFF` | Cards, modais |
| | Surface Elevated | `#F9FAFB` | Elementos destacados |
| **30% - Neutro Escuro** | Text Heading | `#111827` | Titulos |
| | Text Primary | `#1F2937` | Texto principal |
| | Text Secondary | `#6B7280` | Texto secundario |
| | Text Muted | `#9CA3AF` | Texto auxiliar |
| | Border | `#E5E7EB` | Bordas padrao |
| **10% - Accent** | Primary | `#2E63CD` | Acoes principais, links |
| | Primary Hover | `#2451A8` | Hover em elementos primarios |
| | Primary Light | `#EBF0FA` | Background de selecao |

### Cores de Feedback

| Status | Background | Text | Uso |
|--------|------------|------|-----|
| Success | `#D1FAE5` | `#065F46` | Sucesso, confirmacao |
| Warning | `#FEF3C7` | `#92400E` | Alertas, atencao |
| Error/Danger | `#FEE2E2` | `#991B1B` | Erros, acoes destrutivas |
| Info | `#DBEAFE` | `#1E40AF` | Informacoes |

### Cores de Categoria

| Categoria | Hex | Uso |
|-----------|-----|-----|
| Purple | `#8B5CF6` | Custom/Personalizado |
| Blue | `#2E63CD` | Behavioral/Comportamental |
| Green | `#10B981` | Technical/Tecnico |
| Orange | `#F59E0B` | Objection/Objecoes |
| Red | `#EF4444` | Closing/Fechamento |

---

## Badges de Dificuldade

Os badges de dificuldade devem **sempre** estar posicionados no **canto superior direito** do card.

| Dificuldade | Background | Text | Label |
|-------------|------------|------|-------|
| Iniciante | `#D1FAE5` | `#065F46` | "Iniciante" |
| Intermediario | `#FEF3C7` | `#92400E` | "Intermediario" |
| Avancado | `#FEE2E2` | `#991B1B` | "Avancado" |

```tsx
// Exemplo de implementacao
<Chip
  size="sm"
  className={cn(
    "absolute top-3 right-3 text-xs font-medium",
    difficulty === "beginner" && "bg-[#D1FAE5] text-[#065F46]",
    difficulty === "intermediate" && "bg-[#FEF3C7] text-[#92400E]",
    difficulty === "advanced" && "bg-[#FEE2E2] text-[#991B1B]"
  )}
>
  {label}
</Chip>
```

---

## Tipografia

**Fonte:** Inter

| Estilo | Size | Weight | Line Height | Uso |
|--------|------|--------|-------------|-----|
| Heading 1 | 48px | 700 | 56px | Titulos de pagina |
| Heading 2 | 32px | 600 | 40px | Secoes principais |
| Heading 3 | 24px | 600 | 32px | Subsecoes |
| Body Large | 18px | 400 | 28px | Texto destaque |
| Body | 16px | 400 | 24px | Texto padrao |
| Body Small | 14px | 400 | 20px | Texto secundario |
| Caption | 12px | 500 | 16px | Labels, legendas |

---

## Border Radius

| Token | Valor | Uso |
|-------|-------|-----|
| `radius-sm` | 4px | Inputs pequenos |
| `radius-md` | 8px | Botoes, inputs |
| `radius-lg` | 12px | Cards pequenos |
| `radius-xl` | 16px | Cards, modais |
| `radius-2xl` | 24px | Cards grandes |
| `radius-full` | 9999px | Avatares, pills |

---

## Estados de Selecao

### Card Selecionado
```tsx
// Nao selecionado
className="bg-[#FAFAFA] hover:bg-white border border-[#E5E7EB]"

// Selecionado (borda sutil)
className="bg-[#F0F4FA] border border-[#C5D4ED]"
```

### Item de Menu Ativo
```tsx
// Nao ativo
className="text-[#6B7280] hover:bg-[#F5F5F5] hover:text-[#1F2937]"

// Ativo
className="bg-[#EBF0FA] text-[#2E63CD]"
```

---

## Sombras

A aplicacao **nao utiliza sombras** (box-shadow). A hierarquia visual e criada atraves de:
- Bordas sutis (`border-[#E5E7EB]`)
- Cores de fundo diferenciadas
- Espacamento

---

## Botoes

**Importante:** Todos os botões devem ter **bordas arredondadas** e **outlines sutis** quando focados.

### Primario
```tsx
<Button
  className="bg-[#2E63CD] hover:bg-[#2451A8] text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
>
  Ação Principal
</Button>
```

**Características:**
- Bordas: `rounded-xl` (12px)
- Sombra: `shadow-md` default, `shadow-lg` no hover
- Transição: `transition-all duration-200`

### Secundario/Outlined (Outline Sutil)
```tsx
<Button
  variant="bordered"
  className="border-2 border-[#2E63CD] text-[#2E63CD] hover:bg-[#EBF0FA] rounded-xl transition-all duration-200"
>
  Ação Secundária
</Button>
```

**Características:**
- Bordas: `rounded-xl` (12px)
- Borda grossa: `border-2` para melhor visibilidade
- Outline sutil: `border-2 border-[#2E63CD]`
- Transição: `transition-all duration-200`

**Para Roleplays Sugeridos (Cards):**
```tsx
<Button
  variant="bordered"
  className="w-full font-medium border-2 border-[#2E63CD] text-[#2E63CD] hover:bg-[#EBF0FA] rounded-xl transition-all duration-200"
>
  Praticar
</Button>
```

### Ghost Button (Ação Discreta)
```tsx
<Button
  variant="ghost"
  className="text-[#6B7280] rounded-lg hover:bg-[#F9FAFB] transition-colors"
>
  Mais opções
</Button>
```

**Características:**
- Bordas: `rounded-lg` (8px)
- Hover sutil: `hover:bg-[#F9FAFB]`
- Transição: `transition-colors`

### Sucesso (Acoes positivas)
```tsx
<Button color="success">
  // bg-[#10B981] text-white
</Button>
```

### Danger (Acoes destrutivas)
```tsx
<Button color="danger">
  // bg-[#EF4444] text-white
</Button>
```

---

## Fluxo de Analytics Pós-Chamada

**Comportamento Padrão:** Quando uma chamada de roleplay é finalizada, o usuário é **automaticamente redirecionado** para a tela de analytics após 2 segundos.

**Implementação:**
- Página de cenário (`/roleplays/scenario/[slug]`): Redireciona para `/roleplays/[id]/analytics`
- Componente `VoiceInterface`: Suporta redirecionamento via prop `redirectToAnalytics={true}` (padrão)

```tsx
// Em qualquer página que use VoiceInterface
<VoiceInterface
  agent={mockAgent}
  roleplayId="1"
  redirectToAnalytics={true} // Padrão - redireciona automaticamente
  onEnd={() => console.log("Chamada finalizada")}
/>
```

**Visual ao Encerrar:**
- Avatar com borda verde pulsando
- Texto "Chamada encerrada"
- Indicador de redirecionamento
- Duração da chamada exibida

## Padrão de Cores

**IMPORTANTE:** Azul é usado APENAS para botões primários (solid). Todos os outros elementos usam cinza neutro.

### Cores Principais
- **Primary (botões solid)**: `#3B82F6` (azul neutro)
- **Borders**: `#E5E7EB` (cinza claro)
- **Text secundário**: `#6B7280` (cinza médio)
- **Hover borders**: `#D1D5DB` (cinza hover)
- **Hover backgrounds**: `#F9FAFB` (cinza muito claro)

### Botões Outline/Bordered
**NUNCA use azul em botões outline** - sempre cinza neutro:
```css
[data-variant="bordered"] {
  border-color: #E5E7EB;
  color: #6B7280;
}
[data-variant="bordered"]:hover {
  border-color: #D1D5DB;
  background-color: #F9FAFB;
  color: #374151;
}
```

## Avatares
**NUNCA use rings/strokes coloridos:**
- ❌ `ring-4 ring-[#2E63CD]`
- ❌ `style={{ "--tw-ring-color": categoryColor }}`
- ✅ Sempre use apenas o avatar com imagem (`src`)
- ✅ Sem bordas coloridas, sem strokes

```tsx
// CORRETO
<Avatar
  src={user.avatar}
  name={user.name}
  className="w-12 h-12"
/>

// ERRADO
<Avatar
  name={user.name}
  className="w-12 h-12 ring-4 ring-[#2E63CD]"
/>
```

## Padrão Universal de Inputs/Selects

**TODOS os inputs e selects devem ter o mesmo estilo:**
- **Fundo**: `#FFFFFF` (branco sólido)
- **Borda**: `2px solid #E5E7EB` (cinza claro - **2px para maior pregnância**)
- **Border-radius**: `0.75rem` (rounded-xl)
- **Min-height**: `48px`
- **Padding**: `0 16px`
- **Shadow**: `0 1px 2px rgba(0,0,0,0.05)`
- **Hover**: Borda `#D1D5DB`, shadow `0 1px 3px rgba(0,0,0,0.1)`
- **Focus**: Ring esfumaçado azul claro, NUNCA borda sólida

**IMPORTANTE:** Bordas de **2px** (não 1px) para garantir pregnância visual adequada.

```css
/* Aplica-se a TODOS - com especificidade aumentada */
[data-slot="input-wrapper"],
[data-slot="select-trigger"],
button[data-slot="trigger"],
.heroui-select [data-slot="trigger"],
.heroui-select button[data-slot="trigger"],
.heroui-select button[role="button"],
input[type="text"],
input[type="email"],
input[type="password"],
input[type="search"] {
  background-color: #FFFFFF !important;
  border: 2px solid #E5E7EB !important;
  border-radius: 0.75rem !important;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
  min-height: 48px !important;
  padding: 0 16px !important;
}
```

**Para componentes específicos:**

```tsx
// Input - DEIXE os estilos globais aplicarem as bordas
<Input
  placeholder="Buscar..."
  // NÃO adicione classNames de border inline
/>

// Select - Adicione classNames explícitos SOMENTE no trigger
// NUNCA use variant="bordered"
<Select
  radius="lg"
  classNames={{
    trigger: "min-h-[48px] !bg-white !border-2 !border-[#E5E7EB] !rounded-xl shadow-sm hover:!border-[#D1D5DB] hover:shadow-md",
    value: "text-[#1F2937] font-medium",
    innerWrapper: "py-2",
  }}
/>
```

**IMPORTANTE - Evitar Bordas Duplicadas:**
- ❌ **NÃO** adicione `!border-2` ou `!border-[#E5E7EB]` em `inputWrapper` de Input
- ✅ Os estilos globais CSS aplicam bordas automaticamente via `[data-slot="input-wrapper"]`
- ❌ **NÃO** adicione estilos de border em inputs internos (`input[type="text"]`, etc)
- ✅ Inputs internos SEMPRE têm `border: 0 !important` via reset universal
- ✅ Sempre adicione `!border-0` no slot `input` dos classNames para garantir

**Reset Universal Aplicado:**
```css
/* Todos os inputs e textareas não têm borda por padrão */
input,
textarea {
  border: 0 !important;
  outline: 0 !important;
}
```

**FormInput Padrão:**
```tsx
classNames={{
  inputWrapper: ["min-h-[48px]"],
  input: ["text-[#1F2937]", "placeholder:text-[#9CA3AF]", "!border-0"],
  innerWrapper: [endContent ? "gap-2" : ""],
}}
```

## Dropdown Styling

**Princípios:**
- **Fundo branco** com sombra suave
- **Bordas arredondadas** (rounded-xl)
- **Hover nos itens**: fundo `#F9FAFB`
- **Padding**: `4px` no listbox
- **Overflow hidden** para respeitar border-radius

**Focus State (Trigger):**
```css
[data-slot="select-trigger"][data-focus="true"] {
  border-color: transparent !important;
  box-shadow: 0 0 0 3px rgba(46, 99, 205, 0.1), 0 0 0 1px rgba(46, 99, 205, 0.3) !important;
}
```
- ✅ Shadow ring esfumaçado ao invés de borda sólida
- ✅ Múltiplas camadas de sombra para efeito suave

**Popover (Dropdown):**
```css
[data-slot="popover"] {
  border: none !important;
  border-radius: 0.75rem !important;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
  overflow: hidden !important;
}
```
- ✅ Sem borda, apenas sombra sutil
- ✅ `overflow: hidden` para respeitar border-radius

**Itens Selecionados:**
```css
[data-slot="listbox-item"][data-selected="true"] {
  background: linear-gradient(135deg, rgba(46, 99, 205, 0.08) 0%, rgba(74, 127, 232, 0.12) 100%) !important;
  font-weight: 500 !important;
}
```
- ✅ Gradiente suave ao invés de cor sólida

**Componente FormSelect:**
```tsx
<Select
  classNames={{
    popoverContent: "rounded-xl border-none shadow-lg overflow-hidden",
    listbox: "p-0 rounded-xl",
    base: "rounded-xl",
  }}
  popoverProps={{
    classNames: {
      content: "p-0 border-none rounded-xl overflow-hidden",
      base: "rounded-xl border-none shadow-lg",
    },
  }}
/>
```

## Focus States (Outlines Sutis e Arredondados)

**Regra global:** Todos os elementos focáveis devem ter outline **sutil** e **arredondado**.

### Implementação
- **Outline sutil:** `rgba(46, 99, 205, 0.3)` com 2px de espessura
- **Offset:** 2px de espaçamento entre elemento e outline
- **Border radius:** Sempre arredondado (0.75rem)
- **Inputs:** Shadow azul sutil em vez de outline
- **NUNCA:** Outlines internos ou rings pesados

### CSS Global (já aplicado em `globals.css`)
```css
/* Focus States - Sutis e Arredondados */
*:focus-visible {
  outline: 2px solid rgba(46, 99, 205, 0.3) !important;
  outline-offset: 2px !important;
  border-radius: 0.75rem !important;
}

button:focus-visible,
a:focus-visible {
  outline: 2px solid rgba(46, 99, 205, 0.4) !important;
  outline-offset: 2px !important;
}

input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: none !important;
  box-shadow: 0 0 0 2px rgba(46, 99, 205, 0.2) !important;
  border-color: #2E63CD !important;
}
```

---

## Espacamento em Layouts

### Paginas com Cards
```tsx
className="p-6 gap-6"
```

### Dentro de Cards
```tsx
// Header do card
className="p-6 pb-4"

// Conteudo do card
className="px-6 pb-6"
```

### Entre secoes
```tsx
className="space-y-6" // ou gap-6
```

---

## Componentes Reutilizaveis

### Card Padrao
```tsx
<div className="bg-white rounded-2xl border border-[#E5E7EB]">
  {children}
</div>
```

### Container de Pagina
```tsx
<div className="h-[calc(100vh-64px)] flex flex-col gap-6 p-6">
  {children}
</div>
```

### Header de Secao
```tsx
<h2 className="text-sm font-medium text-[#6B7280] uppercase tracking-wide">
  Titulo
</h2>
```

---

## Transicoes

Todas as transicoes devem usar:
```css
transition-all duration-200
```

---

## Icones

**Biblioteca:** Heroicons (React)

- Usar variante `outline` por padrao
- Usar variante `solid` para estados ativos
- Tamanhos padrao: `w-4 h-4`, `w-5 h-5`, `w-6 h-6`

---

## Responsividade

| Breakpoint | Largura |
|------------|---------|
| sm | 640px |
| md | 768px |
| lg | 1024px |
| xl | 1280px |
| 2xl | 1536px |

---

## Acessibilidade

- Todos os elementos interativos devem ter `focus-visible` com outline azul
- Contraste minimo de 4.5:1 para texto
- Usar `aria-label` em botoes com apenas icone

---

## Componentes de Formulario (HeroUI)

### REGRA CRITICA
Os estilos de Input, Select, Dropdown e Listbox sao definidos GLOBALMENTE em `globals.css` na secao `HEROUI COMPONENT OVERRIDES`. **NUNCA** remova ou modifique esses estilos.

### Input
```tsx
import { Input } from "@heroui/react";

<Input
  label="Email"
  variant="bordered"
  placeholder="Digite seu email"
/>
```

**Estilos aplicados automaticamente:**
- Fundo: branco (`#FFFFFF`)
- Borda: cinza (`#E5E7EB`)
- Borda hover: cinza escuro (`#D1D5DB`)
- Borda focus: azul primario (`#2E63CD`)
- Border radius: 12px
- Altura minima: 40px

### Select
```tsx
import { Select, SelectItem } from "@heroui/react";

<Select
  label="Categoria"
  variant="bordered"
>
  <SelectItem key="1">Opcao 1</SelectItem>
  <SelectItem key="2">Opcao 2</SelectItem>
</Select>
```

**Estilos aplicados automaticamente:**
- Trigger com mesmos estilos do Input
- Dropdown com fundo branco e borda
- Opcoes com hover em cinza claro
- Opcao selecionada em azul claro

### Dropdown/Menu
```tsx
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";

<Dropdown>
  <DropdownTrigger>
    <Button variant="bordered">Menu</Button>
  </DropdownTrigger>
  <DropdownMenu>
    <DropdownItem>Item 1</DropdownItem>
    <DropdownItem>Item 2</DropdownItem>
  </DropdownMenu>
</Dropdown>
```

### Autocomplete
```tsx
import { Autocomplete, AutocompleteItem } from "@heroui/react";

<Autocomplete
  label="Buscar"
  variant="bordered"
>
  <AutocompleteItem key="1">Resultado 1</AutocompleteItem>
</Autocomplete>
```

---

## Checklist de Validacao

Antes de fazer merge, verifique:

- [ ] Inputs tem fundo branco e borda cinza?
- [ ] Selects abrem dropdown com fundo branco?
- [ ] Opcoes do dropdown tem hover cinza?
- [ ] Opcao selecionada tem fundo azul claro?
- [ ] Focus states mostram borda azul?
- [ ] Nenhum componente tem sombra indesejada?

Se algum item falhar, verifique se os estilos em `globals.css` na secao `HEROUI COMPONENT OVERRIDES` estao intactos.
