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

### Primario
```tsx
<Button color="primary">
  // bg-[#2E63CD] text-white
  // hover: bg-[#2451A8]
</Button>
```

### Secundario/Outlined
```tsx
<Button variant="bordered">
  // border-[#E5E7EB] text-[#6B7280]
  // hover: bg-[#F5F5F5]
</Button>
```

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
