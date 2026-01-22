# Design System - Perfecting SaaS

## 📐 Princípios de Design

### 1. Componentes HeroUI Only
- **SEMPRE** utilizar componentes nativos do HeroUI
- **NUNCA** criar componentes customizados de UI
- **REUTILIZAR** os componentes existentes para manter consistência

### 2. Sistema de Cores

#### Cores da Marca
```css
/* Azul Principal - Usado APENAS em botões primários */
--primary: #2E63CD;
--primary-hover: #2451A8;
--primary-light: #EBF0FA;
```

#### Cores Neutras (Resto da Aplicação)
```css
/* Backgrounds */
--background: #FFFFFF;
--background-secondary: #FAFAFA;
--background-tertiary: #F5F5F5;

/* Borders */
--border: #E5E7EB;
--border-hover: #C5D4ED;

/* Text */
--text-primary: #111827;
--text-secondary: #1F2937;
--text-tertiary: #6B7280;
--text-quaternary: #9CA3AF;
```

#### Cores de Status (HeroUI Defaults)
```css
--success: #10B981;
--warning: #F59E0B;
--danger: #EF4444;
--default: #71717A;
```

### 3. Componentes Permitidos

#### ✅ Componentes HeroUI Aprovados
- `Button` - Botões e ações
- `Card` / `CardBody` / `CardFooter` / `CardHeader` - Cards e containers
- `Input` - Campos de texto
- `Select` / `SelectItem` - Seleção de opções
- `Chip` - Tags e badges
- `Avatar` - Imagens de perfil
- `Dropdown` / `DropdownMenu` / `DropdownItem` - Menus suspensos
- `Modal` / `ModalContent` / `ModalHeader` / `ModalBody` / `ModalFooter` - Modais
- `Progress` - Barras de progresso
- `Accordion` / `AccordionItem` - Acordeões
- `Table` / `TableHeader` / `TableBody` / `TableRow` / `TableCell` - Tabelas
- `Pagination` - Paginação
- `Tabs` / `Tab` - Abas
- `Tooltip` - Dicas contextuais
- `Ripple` - Efeitos de clique

#### ❌ Componentes Customizados (NÃO PERMITIDOS)
- Criar novos componentes de UI do zero
- Wrapppers que modificam comportamento do HeroUI
- Bibliotecas de terceiros para UI (shadcn, Material-UI, etc)

### 4. Variantes de Componentes

#### Button
```tsx
// ✅ CORRETO - Botão Primário (com cor da marca)
<Button className="bg-[#2E63CD] hover:bg-[#2451A8]">
  Ação Principal
</Button>

// ✅ CORRETO - Botão Secundário (neutro)
<Button variant="bordered">
  Ação Secundária
</Button>

// ✅ CORRETO - Botão Ghost (neutro)
<Button variant="ghost">
  Ação Terciária
</Button>

// ❌ ERRADO - Não usar variants não existentes
<Button variant="outline"> // não existe no HeroUI v3
```

#### Chip
```tsx
// ✅ CORRETO - Usar variant="flat" (padrão neutro)
<Chip variant="flat" color="success">Status</Chip>

// ❌ ERRADO - variant="soft" não existe no HeroUI v3
<Chip variant="soft">Status</Chip>
```

#### Card
```tsx
// ✅ CORRETO - Card com interação
<Card isPressable disableRipple={false}>
  <CardBody>Conteúdo</CardBody>
</Card>

// ✅ CORRETO - Card simples
<Card>
  <CardBody>Conteúdo</CardBody>
</Card>
```

### 5. Espaçamento e Layout

#### Grid System
- Usar `grid` e `flex` do Tailwind
- Seguir padrões de espaçamento: `gap-4`, `gap-6`, `gap-8`
- Padding: `p-4`, `p-6`, `px-6 py-4`

#### Bordas e Sombras
```tsx
// Bordas
border border-[#E5E7EB]     // Borda padrão
rounded-xl                   // Border radius médio
rounded-2xl                  // Border radius grande

// Sombras (usar com moderação)
shadow-sm                    // Sombra sutil
shadow-md                    // Sombra média (hover/selected)
```

### 6. Tipografia

```tsx
// Headings
className="text-3xl font-bold text-[#111827]"     // H1
className="text-2xl font-bold text-[#111827]"     // H2
className="text-xl font-semibold text-[#111827]"  // H3
className="text-lg font-semibold text-[#111827]"  // H4

// Body
className="text-base text-[#1F2937]"              // Body normal
className="text-sm text-[#6B7280]"                // Body small
className="text-xs text-[#9CA3AF]"                // Caption
```

### 7. Estados Interativos

#### Hover
```tsx
hover:bg-[#F5F5F5]           // Background hover neutro
hover:bg-[#2451A8]           // Background hover primário
hover:border-[#C5D4ED]       // Border hover
```

#### Active/Selected
```tsx
bg-[#F0F4FA]                 // Background selected
border-2 border-[#2E63CD]    // Border selected
```

#### Disabled
- Usar prop `isDisabled` dos componentes HeroUI
- Não criar estilos customizados de disabled

### 8. Animações

#### Transições
```tsx
transition-all duration-200   // Transição padrão
transition-colors            // Transição apenas de cores
```

#### Ripple Effect
```tsx
// ✅ CORRETO - Usar ripple nativo
<Card isPressable disableRipple={false}>
<Button disableRipple={false}>

// ❌ ERRADO - Criar ripple customizado
```

### 9. Formulários

#### Input
```tsx
<Input
  label="Campo"
  placeholder="Digite aqui"
  isRequired
  isInvalid={hasError}
  errorMessage="Erro aqui"
/>
```

#### Select
```tsx
<Select
  label="Seleção"
  placeholder="Escolha uma opção"
  selectedKeys={new Set([value])}
  onSelectionChange={(keys) => setValue(Array.from(keys)[0])}
  classNames={{
    trigger: "bg-white border border-[#E5E7EB] rounded-xl px-4 py-2.5 hover:border-[#C5D4ED] hover:bg-[#FAFAFA] transition-all duration-200 min-h-[44px]",
    value: "text-[#1F2937] font-medium",
  }}
>
  <SelectItem key="1">Opção 1</SelectItem>
  <SelectItem key="2">Opção 2</SelectItem>
</Select>
```

**Padrão de Estilização:**
- Bordas arredondadas: `rounded-xl`
- Altura mínima: `min-h-[44px]`
- Padding interno: `px-4 py-2.5`
- Hover: borda `#C5D4ED` e fundo `#FAFAFA`
- Transição suave: `transition-all duration-200`

### 10. Ícones

- Usar **@heroicons/react** (24/outline para ícones normais, 24/solid para ícones preenchidos)
- Tamanho padrão: `w-5 h-5` (20px)
- Cor: herdar do texto pai ou usar `text-[#6B7280]` para neutro

### 11. Responsividade

```tsx
// Mobile First
className="flex flex-col gap-4 md:flex-row md:gap-6 lg:gap-8"

// Breakpoints
sm: 640px   // Small
md: 768px   // Medium
lg: 1024px  // Large
xl: 1280px  // Extra Large
```

## 🚫 Regras Importantes

### NÃO FAZER:
1. ❌ Criar componentes customizados que duplicam funcionalidade do HeroUI
2. ❌ Usar bibliotecas de UI de terceiros
3. ❌ Modificar cores padrão do HeroUI (exceto primário)
4. ❌ Criar variantes que não existem no HeroUI
5. ❌ Usar inline styles (usar Tailwind classes)
6. ❌ Criar wrappers desnecessários
7. ❌ Usar `@heroui/theme` para customização avançada (manter padrão)

### SEMPRE FAZER:
1. ✅ Consultar documentação oficial do HeroUI primeiro
2. ✅ Reutilizar componentes existentes
3. ✅ Manter consistência visual
4. ✅ Usar cores neutras (exceto botões primários)
5. ✅ Seguir padrões de nomenclatura do HeroUI
6. ✅ Testar acessibilidade (aria-labels, etc)

## 📚 Recursos

- [HeroUI Docs](https://heroui.com)
- [HeroUI Components](https://heroui.com/docs/components)
- [Tailwind CSS](https://tailwindcss.com)
- [Heroicons](https://heroicons.com)

## 🎨 Exemplo Completo

```tsx
import { Button, Card, CardBody, Chip } from "@heroui/react";
import { PlayIcon } from "@heroicons/react/24/outline";

export function ExampleCard() {
  return (
    <Card 
      isPressable 
      disableRipple={false}
      className="border border-[#E5E7EB] hover:border-[#C5D4ED]"
    >
      <CardBody className="p-6 gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#111827]">
            Título do Card
          </h3>
          <Chip variant="flat" color="success" size="sm">
            Ativo
          </Chip>
        </div>
        
        <p className="text-sm text-[#6B7280]">
          Descrição do conteúdo do card usando cores neutras.
        </p>
        
        <Button 
          disableRipple={false}
          className="w-full bg-[#2E63CD] hover:bg-[#2451A8] text-white"
        >
          <PlayIcon className="w-5 h-5" />
          Ação Principal
        </Button>
      </CardBody>
    </Card>
  );
}
```

---

**Versão:** 1.0  
**Última atualização:** Janeiro 2026  
**Framework:** HeroUI v3 + Next.js 16 + Tailwind CSS v4
