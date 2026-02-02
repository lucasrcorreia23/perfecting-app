"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
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
  XMarkIcon,
  BookOpenIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  PlayCircleIcon as PlayCircleIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  TrophyIcon as TrophyIconSolid,
  UsersIcon as UsersIconSolid,
  AcademicCapIcon as AcademicCapIconSolid,
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
  isOpen?: boolean;
  onClose?: () => void;
}

const getNavigationItems = (variant: "seller" | "admin"): SidebarItem[] => {
  const roleplaySubmenu = [
    { label: "Personas", href: "/roleplays", icon: BookOpenIcon },
    { label: "Venda B2B", href: "/roleplays/scenario/venda-b2b", icon: BriefcaseIcon },
    { label: "Suporte", href: "/roleplays/scenario/atendimento", icon: ChatBubbleLeftRightIcon },
    { label: "Negociação", href: "/roleplays/scenario/negociacao", icon: ScaleIcon },
    { label: "Cold Call", href: "/roleplays/scenario/cold-call", icon: PhoneIcon },
    { label: "Fechamento", href: "/roleplays/scenario/fechamento", icon: CheckCircleIcon },
  ];

  const baseItems: SidebarItem[] = [
    { label: "Dashboard", href: variant === "admin" ? "/admin" : "/dashboard", icon: HomeIcon, iconSolid: HomeIconSolid },
    { label: "Trilhas", href: "/trilhas", icon: AcademicCapIcon, iconSolid: AcademicCapIconSolid },
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

export function Sidebar({ variant = "seller", isOpen = false, onClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const items = getNavigationItems(variant);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Track previous pathname to detect actual route changes
  const prevPathnameRef = useRef(pathname);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile && isOpen && onClose && prevPathnameRef.current !== pathname) {
      onClose();
    }
    prevPathnameRef.current = pathname;
  }, [pathname, isMobile, isOpen, onClose]);

  const toggleSubmenu = (label: string) => {
    setExpandedMenus((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const isSubmenuActive = (item: SidebarItem) => {
    if (!item.submenu) return false;
    return item.submenu.some((sub) => pathname.startsWith(sub.href));
  };

  // Mobile: fullscreen overlay sidebar
  if (isMobile) {
    return (
      <>
        {/* Overlay backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
            onClick={onClose}
            aria-hidden="true"
          />
        )}
        
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed left-0 top-0 h-screen bg-white transition-transform duration-300 z-50 w-full",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex flex-col h-full">
            {/* Header with logo and close button */}
            <div className="h-16 px-4 flex items-center justify-between border-b border-[#E5E7EB] flex-shrink-0">
              <Link href="/dashboard" className="flex items-center gap-2" onClick={onClose}>
                <span className="font-semibold text-lg text-[#111827]">Perfecting</span>
              </Link>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-[#6B7280] hover:bg-[#F5F5F5] hover:text-[#1F2937] transition-colors"
                aria-label="Fechar menu"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            {/* Navigation items */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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
                          "flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all duration-200 w-full",
                          isActive
                            ? "bg-[#EBF0FA] text-[#2E63CD]"
                            : "text-[#6B7280] hover:bg-[#F5F5F5] hover:text-[#1F2937]"
                        )}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium text-sm">{item.label}</span>
                        <ChevronDownIcon
                          className={cn(
                            "w-4 h-4 ml-auto transition-transform duration-200",
                            isExpanded && "rotate-180"
                          )}
                        />
                      </button>
                      {/* Submenu */}
                      {isExpanded && (
                        <div className="ml-4 mt-1 space-y-1 pl-3">
                          {item.submenu.map((subItem) => {
                            const isSubActive = subItem.href === "/roleplays"
                              ? pathname === "/roleplays"
                              : pathname.startsWith(subItem.href);
                            const SubIcon = subItem.icon;
                            return (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                onClick={onClose}
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
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 py-2.5 pl-3 pr-5 rounded-xl transition-all duration-200",
                      isActive
                        ? "bg-[#EBF0FA] text-[#2E63CD]"
                        : "text-[#6B7280] hover:bg-[#F5F5F5] hover:text-[#1F2937]"
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium text-sm">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto bg-[#2E63CD] text-white text-xs font-medium px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>
      </>
    );
  }

  // Desktop: fixed sidebar
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
      </div>
    </aside>
  );
}
 