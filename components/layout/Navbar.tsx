"use client";

import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Navbar as HeroNavbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Badge, Avatar } from "@heroui/react";
import { useState } from "react";
import Link from "next/link";
import {
  BellIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

interface NavbarProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role: "admin" | "seller";
  };
}

export function Navbar({ user }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <HeroNavbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="full"
      className="bg-white border-b border-[#E5E7EB] h-16"
      classNames={{
        wrapper: "px-6",
      }}
    >
      {/* Mobile menu toggle */}
      <NavbarContent className="sm:hidden">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
        />
      </NavbarContent>

      {/* Logo */}
      <NavbarContent className="pr-3">
        <NavbarBrand>
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="font-semibold text-lg text-[#111827]">
              Perfecting
            </span>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop navigation */}
      <NavbarContent className="hidden sm:flex gap-8">
        {user?.role === "admin" && (
          <NavbarItem>
            <Link
              href="/admin"
              className="text-[#6B7280] hover:text-[#1F2937] transition-colors text-sm font-medium"
            >
              Admin
            </Link>
          </NavbarItem>
        )}
      </NavbarContent>

      {/* Right side actions */}
      <NavbarContent className="gap-4">
        {/* Notifications */}
        <NavbarItem>
          <Dropdown >
            <DropdownTrigger>
              <Button 
                isIconOnly 
                variant="ghost" 
                className="text-[#6B7280]"
                aria-label="Notificações"
              >
                <Badge content="3" color="danger">
                  <BellIcon className="w-5 h-5" />
                </Badge>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Notificações" className="w-80">
              <DropdownItem
                key="notification-1"
                
              >
                Nova conquista desbloqueada
              </DropdownItem>
              <DropdownItem
                key="notification-2"
                
              >
                Novo conteúdo disponível
              </DropdownItem>
              <DropdownItem
                key="notification-3"
                
              >
                Progresso semanal
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>

        {/* User menu */}
        <NavbarItem>
          <Dropdown >
            <DropdownTrigger>
              <Avatar
                as="button"
                className="transition-transform"
                name={user?.name || "Usuário"}
                size="sm"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Menu do usuário" >
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold text-[#111827]">{user?.name || "Usuário"}</p>
                <p className="text-sm text-[#6B7280]">{user?.email || "email@exemplo.com"}</p>
              </DropdownItem>
              <DropdownItem
                key="my-profile"
                
              >
                Meu Perfil
              </DropdownItem>
              <DropdownItem
                key="metrics"
                
              >
                Minhas Métricas
              </DropdownItem>
              <DropdownItem
                key="settings"
                
              >
                Configurações
              </DropdownItem>
              <DropdownItem
                key="logout"
                
                
              >
                Sair
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>

      {/* Mobile menu */}
      <NavbarMenu className="bg-white pt-6">
        {user?.role === "admin" && (
          <NavbarMenuItem>
            <Link
              href="/admin"
              className="w-full text-[#1F2937] text-lg py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Admin
            </Link>
          </NavbarMenuItem>
        )}
      </NavbarMenu>
    </HeroNavbar>
  );
}
