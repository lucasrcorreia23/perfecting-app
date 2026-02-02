"use client";

import { useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Badge,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Textarea,
} from "@heroui/react";
import {
  BellIcon,
  ChatBubbleLeftEllipsisIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts";

interface ContentHeaderProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role: "admin" | "seller";
  };
  onMenuOpen?: () => void;
  isMobile?: boolean;
}

export function ContentHeader({ user, onMenuOpen, isMobile = false }: ContentHeaderProps) {
  const { logout } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      // Aqui você pode integrar com um chatbot ou sistema de suporte
      console.log("Mensagem enviada:", chatMessage);
      setChatMessage("");
    }
  };

  const handleWhatsAppRedirect = () => {
    // Substitua pelo número do WhatsApp da empresa
    const whatsappNumber = "5511999999999";
    const message = encodeURIComponent("Olá! Preciso de ajuda com a plataforma Perfecting.");
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  // Shared components for notifications, chat, and profile
  const dropdownItemClasses = {
    base: "rounded-lg data-[hover=true]:bg-[#F9FAFB] data-[pressed=true]:opacity-80 data-[focus-visible=true]:outline-none data-[focus-visible=true]:ring-2 data-[focus-visible=true]:ring-[#E5E7EB] data-[focus-visible=true]:ring-inset data-[focus-visible=true]:ring-offset-0",
  };

  const NotificationsDropdown = () => (
    <Dropdown
      classNames={{ content: "p-0 outline-none ring-0 rounded-xl shadow-lg border border-[#E5E7EB] bg-white min-w-[280px]" }}
    >
      <DropdownTrigger>
        <button
          className="p-2 rounded-xl flex justify-center items-center text-[#6B7280] hover:bg-[#F5F5F5] hover:text-[#1F2937] transition-colors"
          aria-label="Notificações"
        >
          <Badge content="3" className="bg-red-500 text-white text-[8px]" color="danger" size="sm">
            <BellIcon className="w-6 h-6" />
          </Badge>
        </button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Notificações"
        variant="flat"
        color="default"
        classNames={{
          base: "p-2",
          list: "gap-1",
        }}
        itemClasses={dropdownItemClasses}
      >
        <DropdownItem
          key="notification-1"
          className="rounded-lg py-3"
        >
          <div>
            <p className="text-sm font-medium text-[#111827]">Nova conquista desbloqueada</p>
            <p className="text-xs text-[#6B7280] mt-0.5">Há 5 minutos</p>
          </div>
        </DropdownItem>
        <DropdownItem
          key="notification-2"
          className="rounded-lg py-3"
        >
          <div>
            <p className="text-sm font-medium text-[#111827]">Novo conteúdo disponível</p>
            <p className="text-xs text-[#6B7280] mt-0.5">Há 1 hora</p>
          </div>
        </DropdownItem>
        <DropdownItem
          key="notification-3"
          className="rounded-lg py-3"
        >
          <div>
            <p className="text-sm font-medium text-[#111827]">Seu progresso semanal está pronto</p>
            <p className="text-xs text-[#6B7280] mt-0.5">Há 2 horas</p>
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );

  const HelpChatPopover = () => (
    <Popover
      isOpen={isChatOpen}
      onOpenChange={setIsChatOpen}
      placement="bottom-end"
      offset={10}
    >
      <PopoverTrigger>
        <button
          className="p-2 rounded-xl text-[#6B7280] hover:bg-[#F5F5F5] hover:text-[#1F2937] transition-colors"
          aria-label="Ajuda"
        >
          <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 rounded-xl shadow-lg border border-[#E5E7EB] bg-white">
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#2E63CD] flex items-center justify-center">
                <ChatBubbleLeftEllipsisIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#111827]">Central de Ajuda</p>
                <p className="text-xs text-[#6B7280]">Como podemos ajudar?</p>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="p-1 rounded-lg text-[#6B7280] hover:bg-[#F5F5F5] transition-colors"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Chat area */}
          <div className="p-4 space-y-3">
            <p className="text-sm text-[#6B7280]">
              Tem alguma dúvida sobre a plataforma? Digite sua pergunta abaixo ou fale conosco pelo WhatsApp.
            </p>

            <Textarea
              placeholder="Digite sua pergunta..."
              value={chatMessage}
              onValueChange={setChatMessage}
              minRows={3}
              classNames={{
                input: "text-sm",
                inputWrapper: "border border-[#E5E7EB] rounded-xl bg-[#F9FAFB] hover:bg-white focus-within:bg-white",
              }}
            />

            <Button
              onPress={handleSendMessage}
              isDisabled={!chatMessage.trim()}
              className="w-full bg-[#2E63CD] hover:bg-[#2451A8] text-white font-medium rounded-xl"
              endContent={<PaperAirplaneIcon className="w-4 h-4" />}
            >
              Enviar pergunta
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E5E7EB]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-[#6B7280]">ou</span>
              </div>
            </div>

            <Button
              variant="bordered"
              onPress={handleWhatsAppRedirect}
              className="w-full border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 font-medium rounded-xl"
              startContent={
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              }
            >
              Falar pelo WhatsApp
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );

  const UserProfileDropdown = ({ showDetails = false }: { showDetails?: boolean }) => (
    <Dropdown
      classNames={{ content: "p-1 outline-none ring-0 rounded-xl shadow-lg border border-[#E5E7EB] bg-white min-w-[240px]" }}
    >
      <DropdownTrigger>
        <button className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-[#F5F5F5] transition-all">
          <Avatar
            src={user?.avatar}
            name={user?.name || "Usuário"}
            size="sm"
            classNames={{
              base: "bg-[#1F2937]",
              name: "text-white font-semibold",
            }}
          />
          {showDetails && (
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-[#111827] leading-tight">{user?.name || "Usuário"}</p>
              <p className="text-xs text-[#6B7280] leading-tight">{user?.email || "email@exemplo.com"}</p>
            </div>
          )}
        </button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Menu do usuário"
        variant="flat"
        color="default"
        classNames={{
          base: "p-1",
          list: "gap-1",
        }}
        itemClasses={dropdownItemClasses}
      >
        <DropdownItem key="my-profile" className="rounded-lg">
          Meu Perfil
        </DropdownItem>
        <DropdownItem key="metrics" className="rounded-lg">
          Minhas Métricas
        </DropdownItem>
        <DropdownItem key="settings" className="rounded-lg">
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
  );

  // Mobile header
  if (isMobile) {
    return (
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#E5E7EB] z-30 flex items-center justify-between px-4">
        <div className="flex items-center">
          <button
            onClick={onMenuOpen}
            className="p-2 rounded-xl text-[#6B7280] hover:bg-[#F5F5F5] hover:text-[#1F2937] transition-colors"
            aria-label="Abrir menu"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          <span className="ml-3 font-semibold text-lg text-[#111827]">Perfecting</span>
        </div>
        <div className="flex items-center gap-1">
          <NotificationsDropdown />
          <HelpChatPopover />
          <UserProfileDropdown showDetails={false} />
        </div>
      </header>
    );
  }

  // Desktop header
  return (
    <header className="hidden lg:flex items-center justify-end gap-4 h-16 px-8 bg-white border-b border-[#E5E7EB]">
      <NotificationsDropdown />
      <HelpChatPopover />
      <UserProfileDropdown showDetails={true} />
    </header>
  );
}
