"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@heroui/react";
import {
  HomeIcon,
  PlayCircleIcon,
  ChartBarIcon,
  TrophyIcon,
  UsersIcon,
  ChevronDownIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  ScaleIcon,
  PhoneIcon,
  CheckCircleIcon,
  Bars3Icon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  BookOpenIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  PlayCircleIcon as PlayCircleIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  TrophyIcon as TrophyIconSolid,
  UsersIcon as UsersIconSolid,
} from "@heroicons/react/24/solid";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  iconSolid: React.ComponentType<{ className?: string }>;
  badge?: number;
  hasSubmenu?: boolean;
  submenu?: { label: string; href: string; icon?: React.ComponentType<{ className?: string }> }[];
}

interface SidebarProps {
  variant?: "seller" | "admin";
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role: "admin" | "seller";
  };
}

const getNavigationItems = (variant: "seller" | "admin"): SidebarItem[] => {
  const roleplaySubmenu = [
    { label: "Biblioteca", href: "/roleplays", icon: BookOpenIcon },
    ...(variant === "admin" ? [{ label: "Criar Roleplay", href: "/roleplays/create", icon: PlusCircleIcon }] : []),
    { label: "Venda B2B", href: "/roleplays/scenario/venda-b2b", icon: BriefcaseIcon },
    { label: "Suporte", href: "/roleplays/scenario/atendimento", icon: ChatBubbleLeftRightIcon },
    { label: "Negociação", href: "/roleplays/scenario/negociacao", icon: ScaleIcon },
    { label: "Cold Call", href: "/roleplays/scenario/cold-call", icon: PhoneIcon },
    { label: "Fechamento", href: "/roleplays/scenario/fechamento", icon: CheckCircleIcon },
  ];

  const baseItems: SidebarItem[] = [
    { label: "Dashboard", href: variant === "admin" ? "/admin" : "/dashboard", icon: HomeIcon, iconSolid: HomeIconSolid },
    {
      label: "Role-plays",
      href: "/roleplays",
      icon: PlayCircleIcon,
      iconSolid: PlayCircleIconSolid,
      hasSubmenu: true,
      submenu: roleplaySubmenu,
    },
    { label: "Métricas", href: "/metrics", icon: ChartBarIcon, iconSolid: ChartBarIconSolid },
    { label: "Ranking", href: "/ranking", icon: TrophyIcon, iconSolid: TrophyIconSolid },
  ];

  // Admin tem item adicional de usuários
  if (variant === "admin") {
    baseItems.push({ label: "Usuários", href: "/users", icon: UsersIcon, iconSolid: UsersIconSolid });
  }

  return baseItems;
};

export function Sidebar({ variant = "seller", user }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const pathname = usePathname();
  const { logout } = useAuth();
  const items = getNavigationItems(variant);

  const toggleSubmenu = (label: string) => {
    setExpandedMenus((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const isSubmenuActive = (item: SidebarItem) => {
    if (!item.submenu) return false;
    return item.submenu.some((sub) => pathname.startsWith(sub.href));
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-white border-r border-[#E5E7EB] transition-all duration-300 z-40",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header with logo and collapse button */}
        <div className={cn(
          "h-16 px-4 flex items-center border-b border-[#E5E7EB] flex-shrink-0",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          {!isCollapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="font-semibold text-lg text-[#111827]">Perfecting</span>
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-xl text-[#6B7280] hover:bg-[#F5F5F5] hover:text-[#1F2937] transition-colors"
            aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
          >
            <Bars3Icon className="w-5 h-5" />
          </button>
        </div>
        {/* Navigation items */}
        <nav className="flex-1 p-4 space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.href || isSubmenuActive(item);
            const Icon = isActive ? item.iconSolid : item.icon;
            const isExpanded = expandedMenus.includes(item.label);

            if (item.hasSubmenu && item.submenu) {
              return (
                <div key={item.href}>
                  <button
                    onClick={() => toggleSubmenu(item.label)}
                    className={cn(
                      "flex items-center gap-3 py-2.5 rounded-xl transition-all duration-200 w-full",
                      isCollapsed ? "justify-center px-0" : "px-3",
                      isActive
                        ? "bg-[#EBF0FA] text-[#2E63CD]"
                        : "text-[#6B7280] hover:bg-[#F5F5F5] hover:text-[#1F2937]"
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <>
                        <span className="font-medium text-sm">{item.label}</span>
                        <ChevronDownIcon
                          className={cn(
                            "w-4 h-4 ml-auto transition-transform duration-200",
                            isExpanded && "rotate-180"
                          )}
                        />
                      </>
                    )}
                  </button>
                  {/* Submenu */}
                  {!isCollapsed && isExpanded && (
                    <div className="ml-4 mt-1 space-y-1 pl-3">
                      {item.submenu.map((subItem) => {
                        // Para "Biblioteca" (/roleplays), só marca como ativo se for exatamente essa rota
                        // Para outros itens, usa startsWith normalmente
                        const isSubActive = subItem.href === "/roleplays" 
                          ? pathname === "/roleplays"
                          : pathname.startsWith(subItem.href);
                        const SubIcon = subItem.icon;
                        return (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={cn(
                              "flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 text-sm",
                              isSubActive
                                ? "bg-[#EBF0FA] text-[#2E63CD] font-medium"
                                : "text-[#6B7280] hover:bg-[#F5F5F5] hover:text-[#1F2937]"
                            )}
                          >
                            {SubIcon && <SubIcon className="w-4 h-4 flex-shrink-0" />}
                            <span>{subItem.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 py-2.5 rounded-xl transition-all duration-200",
                  isCollapsed ? "justify-center px-0" : "pl-3 pr-5",
                  isActive
                    ? "bg-[#EBF0FA] text-[#2E63CD]"
                    : "text-[#6B7280] hover:bg-[#F5F5F5] hover:text-[#1F2937]"
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
                {!isCollapsed && item.badge && (
                  <span className="ml-auto bg-[#2E63CD] text-white text-xs font-medium px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User profile */}
        <div className={cn(
          "p-4 border-t border-[#E5E7EB] flex-shrink-0",
          isCollapsed && "flex items-center justify-center"
        )}>
          {isCollapsed ? (
            <Dropdown >
              <DropdownTrigger>
                <button className="p-2 rounded-xl hover:bg-[#F5F5F5] transition-colors">
                  <Avatar
                    className="transition-transform"
                    name={user?.name || "Usuário"}
                    size="sm"
                  />
                </button>
              </DropdownTrigger>
              <DropdownMenu 
                aria-label="Menu do usuário"
                classNames={{
                  base: "rounded-xl shadow-lg border-2 border-[#E5E7EB] bg-white p-2 min-w-[240px]",
                  list: "gap-1",
                }}
              >
                <DropdownItem key="profile" className="h-14 gap-2 rounded-lg hover:bg-transparent cursor-default">
                  <p className="font-semibold text-[#111827]">{user?.name || "Usuário"}</p>
                  <p className="text-sm text-[#6B7280]">{user?.email || "email@exemplo.com"}</p>
                </DropdownItem>
                <DropdownItem
                  key="my-profile"
                  className="rounded-lg hover:bg-[#F9FAFB] transition-colors"
                >
                  Meu Perfil
                </DropdownItem>
                <DropdownItem
                  key="metrics"
                  className="rounded-lg hover:bg-[#F9FAFB] transition-colors"
                >
                  Minhas Métricas
                </DropdownItem>
                <DropdownItem
                  key="settings"
                  className="rounded-lg hover:bg-[#F9FAFB] transition-colors"
                >
                  Configurações
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  className="text-danger rounded-lg"
                  color="danger"
                  onPress={logout}
                >
                  Sair
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Dropdown >
              <DropdownTrigger>
                <button className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-[#F5F5F5] transition-colors text-left">
                  <Avatar
                    className="transition-transform"
                    name={user?.name || "Usuário"}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#111827] truncate">{user?.name || "Usuário"}</p>
                    <p className="text-xs text-[#6B7280] truncate">{user?.email || "email@exemplo.com"}</p>
                  </div>
                  <ChevronDownIcon className="w-4 h-4 text-[#6B7280] flex-shrink-0" />
                </button>
              </DropdownTrigger>
              <DropdownMenu 
                aria-label="Menu do usuário"
                classNames={{
                  base: "rounded-xl shadow-lg border-2 border-[#E5E7EB] bg-white p-2 min-w-[240px]",
                  list: "gap-1",
                }}
              >
                <DropdownItem
                  key="my-profile"
                  className="rounded-lg hover:bg-[#F9FAFB] transition-colors"
                >
                  Meu Perfil
                </DropdownItem>
                <DropdownItem
                  key="metrics"
                  className="rounded-lg hover:bg-[#F9FAFB] transition-colors"
                >
                  Minhas Métricas
                </DropdownItem>
                <DropdownItem
                  key="settings"
                  className="rounded-lg hover:bg-[#F9FAFB] transition-colors"
                >
                  Configurações
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  className="text-danger rounded-lg"
                  color="danger"
                  onPress={logout}
                >
                  Sair
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
      </div>
    </aside>
  );
}
 