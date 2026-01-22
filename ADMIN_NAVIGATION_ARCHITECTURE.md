# Arquitetura de Navegação do Administrador

## 🎯 Objetivo

Permitir que o **administrador navegue entre todos os módulos** (dashboard, roleplays, métricas, ranking) **sem perder as permissões de admin**, mantendo acesso completo a funcionalidades administrativas.

## 🏗️ Arquitetura Implementada

### 1. **AuthContext Global** (Fonte Única da Verdade)

Arquivo: `contexts/AuthContext.tsx`

```tsx
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role?: "admin" | "seller") => Promise<void>;
  logout: () => void;
  isAdmin: boolean;  // ✅ Helper para verificar papel
  isSeller: boolean; // ✅ Helper para verificar papel
}
```

**Estado persistente:**
- `user.role` é mantido durante toda a sessão
- Não muda ao navegar entre rotas
- Único ponto de controle de autenticação

### 2. **Layouts Inteligentes**

#### Layout do Dashboard (`app/(dashboard)/layout.tsx`)

```tsx
export default function DashboardLayout({ children }) {
  const { user } = useAuth();
  
  // Usa o papel REAL do usuário
  const variant = user.role; // "admin" ou "seller"
  
  return (
    <Sidebar variant={variant} user={user} />
    <main>{children}</main>
  );
}
```

**Comportamento:**
- **Admin** em `/dashboard` → Vê sidebar de admin
- **Admin** em `/roleplays` → Vê sidebar de admin
- **Admin** em `/metrics` → Vê sidebar de admin
- **Seller** em `/dashboard` → Vê sidebar de seller

#### Layout do Admin (`app/(admin)/layout.tsx`)

```tsx
export default function AdminLayout({ children }) {
  const { user, isAdmin } = useAuth();
  
  // Proteção de rota
  useEffect(() => {
    if (!user) router.push("/login");
    if (!isAdmin) router.push("/dashboard"); // Seller não pode acessar
  }, [user, isAdmin]);
  
  return (
    <Sidebar variant="admin" user={user} />
    <main>{children}</main>
  );
}
```

**Proteções:**
- Apenas admin pode acessar `/admin`, `/users`, `/roleplays/create`
- Seller é redirecionado automaticamente para `/dashboard`

### 3. **Sidebar Adaptativo**

Arquivo: `components/layout/Sidebar.tsx`

```tsx
const getNavigationItems = (variant: "seller" | "admin"): SidebarItem[] => {
  const baseItems = [
    { label: "Dashboard", href: variant === "admin" ? "/admin" : "/dashboard" },
    { label: "Role-plays", href: "/roleplays", hasSubmenu: true },
    { label: "Métricas", href: "/metrics" },
    { label: "Ranking", href: "/ranking" },
  ];

  // Admin tem item adicional
  if (variant === "admin") {
    baseItems.push({ label: "Usuários", href: "/users" });
  }

  return baseItems;
};
```

**Vantagens:**
- Menu se adapta automaticamente ao papel do usuário
- Admin vê item "Usuários"
- Admin pode criar roleplays
- Links sempre corretos baseados no papel

## 🔐 Fluxo de Navegação do Admin

### Cenário 1: Admin acessando módulos de vendedor

```
1. Login como admin@perfecting.com
   ↓
2. AuthContext: user.role = "admin", isAdmin = true
   ↓
3. Acessa /dashboard (dashboard de vendedor)
   ↓
4. Layout detecta user.role = "admin"
   ↓
5. Sidebar renderiza com variant="admin"
   ✅ Mantém permissões de admin
   ✅ Vê menu completo incluindo "Usuários"
   ✅ Pode criar roleplays
   ↓
6. Navega para /roleplays
   ↓
7. Página detecta isAdmin = true
   ✅ Mostra botão "Criar Personagem"
   ✅ Pode gerenciar personagens
   ↓
8. Navega para /metrics
   ↓
9. Sidebar continua com variant="admin"
   ✅ Permissões mantidas
```

### Cenário 2: Admin acessando módulos exclusivos

```
1. Admin navega para /admin
   ↓
2. Admin layout verifica isAdmin
   ✅ Permite acesso
   ↓
3. Admin navega para /users
   ↓
4. Sidebar mantém variant="admin"
   ✅ Item "Usuários" visível e ativo
   ↓
5. Admin volta para /roleplays
   ↓
6. Dashboard layout usa user.role
   ✅ Ainda mostra sidebar de admin
   ✅ Permissões preservadas
```

### Cenário 3: Seller tentando acessar admin

```
1. Login como vendedor@perfecting.com
   ↓
2. AuthContext: user.role = "seller", isAdmin = false
   ↓
3. Tenta acessar /admin
   ↓
4. Admin layout verifica isAdmin = false
   ❌ Redirecionado para /dashboard
   ↓
5. Acessa /users diretamente
   ↓
6. Admin layout detecta !isAdmin
   ❌ Redirecionado para /dashboard
```

## 🎨 Diferenças Visuais por Papel

### Sidebar do Admin

```
┌─────────────────┐
│ Perfecting      │
├─────────────────┤
│ 🏠 Dashboard    │ → /admin
│ ▶ Role-plays    │
│   📚 Biblioteca │
│   ➕ Criar      │ ← Só admin
│   💼 Venda B2B  │
│   🎧 Suporte    │
│   🤝 Negociação │
│   ❄️ Cold Call  │
│   🎯 Fechamento │
│ 📊 Métricas     │
│ 🏆 Ranking      │
│ 👥 Usuários     │ ← Só admin
└─────────────────┘
```

### Sidebar do Seller

```
┌─────────────────┐
│ Perfecting      │
├─────────────────┤
│ 🏠 Dashboard    │ → /dashboard
│ ▶ Role-plays    │
│   📚 Biblioteca │
│   💼 Venda B2B  │
│   🎧 Suporte    │
│   🤝 Negociação │
│   ❄️ Cold Call  │
│   🎯 Fechamento │
│ 📊 Métricas     │
│ 🏆 Ranking      │
└─────────────────┘
```

## 📝 Componentes que Usam Papel do Usuário

### Via useAuth Hook

Todos os componentes podem verificar permissões:

```tsx
import { useAuth } from "@/contexts";

function MyComponent() {
  const { user, isAdmin, isSeller } = useAuth();
  
  return (
    <>
      {isAdmin && <AdminOnlyFeature />}
      {isSeller && <SellerOnlyFeature />}
    </>
  );
}
```

### Exemplos Implementados

1. **`app/(dashboard)/roleplays/page.tsx`**
   ```tsx
   const { isAdmin } = useAuth();
   
   {isAdmin && (
     <Button onPress={() => router.push("/roleplays/create")}>
       Criar Personagem
     </Button>
   )}
   ```

2. **`app/(dashboard)/layout.tsx`**
   ```tsx
   const variant = user.role; // Sidebar se adapta
   ```

3. **`app/(admin)/layout.tsx`**
   ```tsx
   if (!isAdmin) {
     router.push("/dashboard"); // Proteção de rota
   }
   ```

## 🔄 Fluxo de Dados

```
Login (/login)
    ↓
AuthContext.login()
    ↓
user.role = "admin" (persistido em memória)
    ↓
Todos os layouts acessam useAuth()
    ↓
    ├─ AdminLayout: variant = "admin" (fixo)
    ├─ DashboardLayout: variant = user.role (dinâmico)
    └─ Componentes: isAdmin, isSeller (helpers)
    ↓
Sidebar renderiza items baseado no variant
    ↓
Navegação mantém estado do AuthContext
```

## ✅ Garantias de Segurança

### 1. Proteção de Rotas

- ✅ Sem login → Redireciona para `/login`
- ✅ Seller acessando `/admin` → Redireciona para `/dashboard`
- ✅ Seller acessando `/users` → Redireciona para `/dashboard`

### 2. Persistência de Permissões

- ✅ Admin em `/dashboard` → Vê sidebar de admin
- ✅ Admin em `/roleplays` → Vê botão "Criar Personagem"
- ✅ Admin em `/metrics` → Mantém todas as permissões
- ✅ Admin em `/ranking` → Sidebar continua adaptado

### 3. UI Condicional

- ✅ Botões administrativos só aparecem para admin
- ✅ Menus de gerenciamento ocultados para seller
- ✅ Opções de edição/exclusão só para admin

## 🎯 Como Testar

### Testar como Admin

1. Login em `/login` com tipo "Administrador"
2. Email: `admin@perfecting.com`
3. Navegar para:
   - `/admin` ✅ Acesso permitido
   - `/dashboard` ✅ Vê sidebar de admin
   - `/roleplays` ✅ Vê botão criar personagem
   - `/metrics` ✅ Permissões mantidas
   - `/users` ✅ Acesso permitido

### Testar como Seller

1. Login em `/login` com tipo "Vendedor"
2. Email: `vendedor@perfecting.com`
3. Navegar para:
   - `/dashboard` ✅ Vê sidebar de seller
   - `/roleplays` ✅ Sem botão criar
   - `/admin` ❌ Redirecionado para `/dashboard`
   - `/users` ❌ Redirecionado para `/dashboard`

## 🚀 Vantagens da Arquitetura

1. **Single Source of Truth**: AuthContext é a única fonte do papel do usuário
2. **Proteção Automática**: Layouts verificam permissões em useEffect
3. **UI Adaptativa**: Componentes se adaptam ao papel do usuário
4. **Zero Configuração Manual**: Papel é detectado automaticamente
5. **Type-Safe**: TypeScript garante uso correto de isAdmin/isSeller
6. **Persistência**: Papel mantido durante toda a sessão
7. **Sem Props Drilling**: useAuth() acessível em qualquer componente

## 📋 Checklist de Implementação

- ✅ AuthContext com user.role persistido
- ✅ Helpers isAdmin e isSeller
- ✅ DashboardLayout usa user.role para variant
- ✅ AdminLayout com proteção de rota
- ✅ Sidebar renderiza items baseado em variant
- ✅ Páginas usam useAuth() para controle de UI
- ✅ Proteção contra acesso não autorizado
- ✅ Redirecionamento automático para sellers

## 🔧 Manutenção

### Adicionar Nova Funcionalidade Admin-Only

```tsx
import { useAuth } from "@/contexts";

function MyNewFeature() {
  const { isAdmin } = useAuth();
  
  if (!isAdmin) return null;
  
  return <AdminFeature />;
}
```

### Adicionar Nova Rota Admin-Only

1. Criar em `app/(admin)/nova-rota/page.tsx`
2. O layout `(admin)/layout.tsx` já protege automaticamente
3. Adicionar item no Sidebar em `getNavigationItems()`

## 📊 Estado da Sessão

```tsx
// Durante toda a sessão
AuthContext = {
  user: {
    id: "1",
    email: "admin@perfecting.com",
    name: "Admin",
    role: "admin", // ← Nunca muda durante navegação
  },
  isAdmin: true,     // ← Derivado de user.role
  isSeller: false,   // ← Derivado de user.role
}

// Navegação não afeta o estado
/admin → /dashboard → /roleplays → /metrics
  ↓         ↓            ↓            ↓
role=admin role=admin  role=admin  role=admin
```

## ✨ Resumo

**Antes:** Papel do usuário poderia se perder ao navegar entre módulos.

**Agora:**
- ✅ Papel persistido no AuthContext global
- ✅ Layouts verificam papel real do usuário
- ✅ Sidebar se adapta automaticamente
- ✅ Admin navega livremente mantendo permissões
- ✅ Seller protegido de acessar rotas admin
- ✅ UI condicional baseada em isAdmin/isSeller

**Admin agora pode navegar por TODO o sistema sem perder permissões!** 🎉
