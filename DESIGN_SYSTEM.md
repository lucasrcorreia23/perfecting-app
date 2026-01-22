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
// ✅ CORRETO - Botão Primário Moderno (com cor da marca)
<Button className="bg-[#2E63CD] hover:bg-[#2451A8] rounded-xl shadow-md hover:shadow-lg transition-all duration-200 min-h-[48px]">
  Ação Principal
</Button>

// ✅ CORRETO - Botão Secundário (neutro)
<Button variant="bordered" className="rounded-xl shadow-sm hover:shadow-md transition-all duration-200 min-h-[48px]">
  Ação Secundária
</Button>

// ✅ CORRETO - Botão Ghost (neutro)
<Button variant="ghost" className="rounded-xl">
  Ação Terciária
</Button>

// ✅ CORRETO - Botão com Loading (Spinner Nativo HeroUI v2)
<Button isDisabled={isLoading} className="rounded-xl shadow-md hover:shadow-lg min-h-[48px]">
  {isLoading && <Spinner size="sm" color="white" className="mr-2" />}
  {isLoading ? "Carregando..." : "Confirmar"}
</Button>

// ❌ ERRADO - Não usar variants não existentes
<Button variant="outline"> // não existe no HeroUI v3
```

**Padrões de Botão:**
- Border radius: `rounded-xl` para consistência
- Altura mínima: `min-h-[48px]` para melhor área de toque
- Shadow: `shadow-md` para primários, `shadow-sm` para secundários
- Transição suave: `transition-all duration-200`
- Loading com Spinner nativo do HeroUI v2 (`size="sm"`, `color="white"` para botões primários)

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

#### Input Moderno (HeroUI v2)
```tsx
// Input simples
<Input
  label="Campo"
  placeholder="Digite aqui"
  isRequired
  isInvalid={hasError}
  errorMessage="Erro aqui"
  classNames={{
    inputWrapper: [
      "bg-white",
      "border",
      "border-[#E5E7EB]",
      "rounded-xl",           // Arredondamento moderno
      "shadow-sm",            // Elevação sutil
      "hover:border-[#C5D4ED]",
      "focus-within:border-[#2E63CD]",
      "transition-all",
      "duration-200",
      "min-h-[48px]",        // Altura confortável (48px)
    ],
    input: [
      "text-[#1F2937]",
      "placeholder:text-[#9CA3AF]",
    ],
  }}
/>

// Input com endContent (ex: ícone de senha)
<Input
  type={isVisible ? "text" : "password"}
  endContent={
    <button onClick={() => setIsVisible(!isVisible)}>
      <EyeIcon className="w-5 h-5 text-[#6B7280]" />
    </button>
  }
  classNames={{
    inputWrapper: [...],
    input: [
      "text-[#1F2937]",
      "placeholder:text-[#9CA3AF]",
      "pr-2",                 // Padding direita quando endContent presente
    ],
    innerWrapper: [
      "gap-2",                // Gap entre input e endContent
    ],
  }}
/>
```

**Características:**
- Border radius: `rounded-xl` para aparência moderna
- Altura mínima: `min-h-[48px]` para melhor usabilidade
- Shadow: `shadow-sm` (aumenta para `shadow-md` no hover)
- Transição suave de borda no focus (muda para cor primária)
- Espaçamento interno gerenciado automaticamente pelo HeroUI

#### Select (HeroUI v2) - Visual Moderno
```tsx
<Select
  label="Seleção"
  placeholder="Escolha uma opção"
  selectedKeys={new Set([value])}
  onSelectionChange={(keys) => setValue(Array.from(keys)[0])}
  className="focus:outline-none"
  variant="bordered"
  radius="lg"
  classNames={{
    trigger: "bg-white border-2 border-[#E5E7EB] hover:border-[#2E63CD] data-[hover=true]:bg-[#F9FAFB] rounded-xl shadow-sm hover:shadow-md transition-all duration-200 min-h-[48px] focus:outline-none focus:ring-0",
    value: "text-[#1F2937] font-medium",
    innerWrapper: "py-2",
    popoverContent: "rounded-xl",
  }}
  popoverProps={{
    classNames: {
      content: "rounded-xl shadow-lg border-2 border-[#E5E7EB]",
    },
  }}
>
  <SelectItem key="1">Opção 1</SelectItem>
  <SelectItem key="2">Opção 2</SelectItem>
</Select>
```

**Padrão de Estilização Moderno:**
- `variant="bordered"` para bordas visíveis
- `radius="lg"` para bordas arredondadas (12px)
- **Borda grossa**: `border-2` (2px) para melhor definição
- **Hover interativo**: `hover:border-[#2E63CD]` (cor primária)
- **Sombras**: `shadow-sm` default, `shadow-md` no hover, `shadow-lg` no dropdown
- **Transições**: `transition-all duration-200` para animações suaves
- **Fundo branco**: `bg-white` no trigger
- **Altura mínima**: `min-h-[48px]` para boa área de toque
- **Dropdown arredondado**: `popoverContent` e `popoverProps` com `rounded-xl`
- **Sem outline interno**: `focus:outline-none focus:ring-0` no trigger e className principal

**Slots Importantes:**
- `trigger`: Container clicável (background, border grossa, altura, hover, sombra)
- `value`: Texto do valor selecionado (font-medium para legibilidade)
- `innerWrapper`: Wrapper interno do conteúdo (padding vertical)
- `popoverContent`: Estilo do dropdown
- `popoverProps`: Props adicionais do Popover (border, shadow)

#### Checkbox (HeroUI v2) - Visual Moderno
```tsx
<Checkbox
  isSelected={checked}
  onValueChange={setChecked}
  radius="md"
  color="primary"
  classNames={{
    base: "py-1 focus:outline-none",
    wrapper: "mr-2 after:rounded-md border-2 border-[#E5E7EB] focus:outline-none focus:ring-0",
    label: "text-sm text-[#6B7280] font-medium",
  }}
>
  Lembrar de mim
</Checkbox>
```

**Padrão de Estilização Moderno:**
- **Color primária**: `color="primary"` para azul da marca quando selecionado
- **Bordas arredondadas**: `radius="md"` (8px)
- **Borda visível**: `border-2 border-[#E5E7EB]` no wrapper
- **Checkbox arredondado**: `after:rounded-md` para cantos suaves
- **Label estilizado**: `font-medium` para melhor legibilidade
- **Sem outline interno**: `focus:outline-none focus:ring-0` no wrapper e base
- Espaçamento: `mr-2` entre checkbox e label

**Slots Importantes:**
- `base`: Container principal (padding vertical)
- `wrapper`: O checkbox em si (border, radius, espaçamento)
- `label`: Texto ao lado do checkbox (size, color, weight)

#### DropdownMenu (HeroUI v2) - Visual Moderno
```tsx
<Dropdown>
  <DropdownTrigger>
    <Button>Menu</Button>
  </DropdownTrigger>
  <DropdownMenu
    aria-label="Menu"
    classNames={{
      base: "rounded-xl shadow-lg border-2 border-[#E5E7EB] bg-white p-2 min-w-[240px]",
      list: "gap-1",
    }}
  >
    <DropdownItem 
      key="item1"
      className="rounded-lg hover:bg-[#F9FAFB] transition-colors"
    >
      Item 1
    </DropdownItem>
    <DropdownItem 
      key="item2"
      className="rounded-lg hover:bg-[#F9FAFB] transition-colors"
    >
      Item 2
    </DropdownItem>
    <DropdownItem 
      key="danger"
      className="text-danger rounded-lg"
      color="danger"
    >
      Ação Perigosa
    </DropdownItem>
  </DropdownMenu>
</Dropdown>
```

**Padrão de Estilização Moderno:**
- **Container arredondado**: `rounded-xl` no base
- **Borda visível**: `border-2 border-[#E5E7EB]` para definição
- **Fundo branco**: `bg-white` no base
- **Sombra elevada**: `shadow-lg` para hierarquia visual
- **Padding interno**: `p-2` no base para espaçamento
- **Gap entre itens**: `gap-1` na list
- **Itens arredondados**: `rounded-lg` em cada DropdownItem
- **Hover suave**: `hover:bg-[#F9FAFB] transition-colors`
- **Largura mínima**: `min-w-[240px]` para conteúdo adequado

**Slots Importantes:**
- `base`: Container principal do menu (border, shadow, padding, background)
- `list`: Lista de itens (gap entre itens)

---

## 🎨 Componentes de Analytics e Criação

### AudioPlayer
Player de áudio mockado com controles completos e gradientes:

```tsx
import { AudioPlayer } from "@/components/roleplay";

<AudioPlayer duration={300} audioUrl={mockAudioUrl} />
```

**Features:**
- Play/Pause, timeline, volume, speed control (0.5x-2x)
- Progress bar com gradiente: `bg-gradient-to-r from-[#2E63CD] to-[#4A7FE8]`
- Background com `gradient-neutral`
- Controles com bordas arredondadas

### TranscriptViewer
Visualização de transcript com busca e highlight:

```tsx
import { TranscriptViewer } from "@/components/roleplay";

<TranscriptViewer 
  transcript={mockTranscript}
  searchQuery={searchQuery}
  onEntryClick={(id) => scrollTo(id)}
/>
```

**Características:**
- Chat bubbles diferenciados (user: `bg-[#EBF0FA]`, agent: `bg-[#F5F5F5]`)
- Highlight de busca com `bg-[#FEF3C7]`
- Indicador de sentimento (positivo/neutro/negativo)
- Timestamps clicáveis

### MetricsCard
Card de métrica com gradiente automático baseado em status:

```tsx
import { MetricsCard } from "@/components/analytics";

<MetricsCard
  title="Talk vs Listen Ratio"
  value={60}
  unit="%"
  threshold={{ min: 40, max: 60 }}
  icon={<SpeakerWaveIcon className="w-6 h-6 text-[#2E63CD]" />}
  description="Equilíbrio ideal entre falar e ouvir"
/>
```

**Gradientes automáticos:**
- `status="good"` → `gradient-success`
- `status="warning"` → `gradient-warning`
- `status="danger"` → `gradient-danger`
- `status="neutral"` → sem gradiente

### ObjectionsViewer
Visualização de objeções com bordas laterais coloridas e gradientes:

```tsx
import { ObjectionsViewer } from "@/components/analytics";

<ObjectionsViewer
  objections={mockSessionObjections}
  onViewTranscript={(entryId) => scrollToTranscript(entryId)}
/>
```

**Visual:**
- Objeções tratadas: `border-l-4 border-l-[#10B981]` + `gradient-success`
- Objeções não tratadas: `border-l-4 border-l-[#F59E0B]` + `gradient-warning`
- Chips coloridos por tipo de objeção
- Técnica de tratamento em badge
- Link para transcript

### SessionHistoryChart
Gráfico de evolução com tendência visual:

```tsx
import { SessionHistoryChart } from "@/components/analytics";

<SessionHistoryChart sessions={mockUserSessionHistory.sessions} />
```

**Features:**
- Summary card com `gradient-primary-soft`
- Indicadores de tendência (setas)
- Progress bars por sessão
- Comparação com sessão anterior

### StepIndicator
Indicador de progresso para formulários multi-step:

```tsx
import { StepIndicator } from "@/components/roleplay";

<StepIndicator
  currentStep={3}
  totalSteps={5}
  stepLabels={["Info", "Contexto", "Personagem", "Regras", "Revisão"]}
/>
```

**Visual com gradientes:**
- Step atual: `bg-gradient-to-r from-[#2E63CD] to-[#4A7FE8]` (barra + círculo)
- Steps completados: `bg-[#2E63CD]` azul sólido
- Steps futuros: `bg-[#E5E7EB]` cinza claro
- Transições suaves entre estados

### ReviewStep
Componente de revisão final para formulários:

```tsx
import { ReviewStep } from "@/components/roleplay";

<ReviewStep 
  formData={formData}
  onEdit={(step) => setStep(step)}
/>
```

**Características:**
- Cards com `gradient-neutral` e `gradient-primary-soft`
- Botões "Editar" em cada seção
- Ícones por categoria
- Resumo visual claro

---

#### Progress (HeroUI v2) - Visual Moderno
```tsx
<Progress
  value={75}
  maxValue={100}
  color="success"  // success | warning | danger | primary
  radius="lg"
  size="sm"        // sm | md | lg
  classNames={{
    track: "bg-[#F3F4F6]",
  }}
/>
```

**Padrão de Estilização Moderno:**
- **Sempre incluir**: `value` e `maxValue={100}` para funcionamento correto
- **Bordas arredondadas**: `radius="lg"` para visual suave
- **Track customizado**: `bg-[#F3F4F6]` (cinza claro) para melhor contraste
- **Cores dinâmicas**: 
  - `success` (verde) para >= 80%
  - `warning` (amarelo) para 60-79%
  - `danger` (vermelho) para < 60%
  - `primary` (azul) para uso geral
- **Tamanhos**: `sm` para listas, `md` para cards, `lg` para destaques

**Exemplo com cores condicionais:**
```tsx
<Progress
  value={score}
  maxValue={100}
  color={score >= 80 ? "success" : score >= 60 ? "warning" : "danger"}
  radius="lg"
  size="sm"
  classNames={{
    track: "bg-[#F3F4F6]",
  }}
/>
```

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
