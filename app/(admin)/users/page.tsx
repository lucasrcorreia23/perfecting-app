"use client";

import { useState } from "react";
import { Card, CardHeader, CardBody, Button, Input, Chip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Avatar, Select, SelectItem } from "@heroui/react";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  EllipsisVerticalIcon,
  FunnelIcon,
  EnvelopeIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { mockLeaderboard } from "@/lib/mock-data";
import { cn, getScoreColor } from "@/lib/utils";

// Extended mock users
const mockUsers = [
  ...mockLeaderboard.map((user) => ({
    ...user,
    email: `${user.userName.toLowerCase().replace(" ", ".")}@empresa.com`,
    role: "seller" as const,
    group: "Equipe Comercial",
    status: "active" as const,
    lastActive: "2024-01-20",
  })),
  {
    userId: "admin-1",
    userName: "Admin User",
    userAvatar: "https://i.pravatar.cc/150?u=admin",
    email: "admin@empresa.com",
    role: "admin" as const,
    group: "Administração",
    status: "active" as const,
    lastActive: "2024-01-20",
    rank: 0,
    score: 0,
    sessionsCompleted: 0,
    improvement: 0,
  },
];

const groups = [
  { value: "all", label: "Todos os grupos" },
  { value: "comercial", label: "Equipe Comercial" },
  { value: "inside-sales", label: "Inside Sales" },
  { value: "enterprise", label: "Enterprise" },
];

const statusOptions = [
  { value: "all", label: "Todos os status" },
  { value: "active", label: "Ativos" },
  { value: "inactive", label: "Inativos" },
];

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const pages = Math.ceil(filteredUsers.length / rowsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="heading-2">Gerenciar Usuários</h1>
          <p className="text-[#6B7280] mt-1">
            Adicione, edite e gerencie os membros da sua equipe
          </p>
        </div>

        <Button
          
          className="bg-[#2E63CD] hover:bg-[#2451A8]"
          onPress={() => setIsAddModalOpen(true)}
        >
          <PlusIcon className="w-5 h-5" />
          Adicionar Usuário
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
        <CardBody className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <Input
              placeholder="Buscar por nome ou e-mail..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />

            <div className="flex flex-wrap gap-4">
              <Select
                placeholder="Grupo"
                selectedKeys={new Set([selectedGroup])}
                onSelectionChange={(keys) => setSelectedGroup(Array.from(keys)[0] as string)}
                className="w-44"
                aria-label="Grupo"
                classNames={{
                  trigger: "bg-white border border-[#E5E7EB] rounded-xl px-4 py-2.5 hover:border-[#C5D4ED] hover:bg-[#FAFAFA] transition-all duration-200 min-h-[44px]",
                  value: "text-[#1F2937] font-medium",
                }}
              >
                {groups.map((group) => (
                  <SelectItem key={group.value}>{group.label}</SelectItem>
                ))}
              </Select>

              <Select
                placeholder="Status"
                selectedKeys={new Set([selectedStatus])}
                onSelectionChange={(keys) => setSelectedStatus(Array.from(keys)[0] as string)}
                className="w-36"
                aria-label="Status"
                classNames={{
                  trigger: "bg-white border border-[#E5E7EB] rounded-xl px-4 py-2.5 hover:border-[#C5D4ED] hover:bg-[#FAFAFA] transition-all duration-200 min-h-[44px]",
                  value: "text-[#1F2937] font-medium",
                }}
              >
                {statusOptions.map((status) => (
                  <SelectItem key={status.value}>{status.label}</SelectItem>
                ))}
              </Select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Users table */}
      <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
        <CardHeader className="px-6 py-4 border-b border-[#E5E7EB]">
          <div className="flex items-center justify-between w-full">
            <p className="text-sm text-[#6B7280]">
              {filteredUsers.length} usuário{filteredUsers.length !== 1 && "s"} encontrado{filteredUsers.length !== 1 && "s"}
            </p>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <Table
            aria-label="Tabela de usuários"
            className="w-full"
          >
            <TableHeader>
              <TableColumn>USUÁRIO</TableColumn>
              <TableColumn>FUNÇÃO</TableColumn>
              <TableColumn>GRUPO</TableColumn>
              <TableColumn>SESSÕES</TableColumn>
              <TableColumn>SCORE MÉDIO</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>AÇÕES</TableColumn>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={user.userName}
                        size="sm"
                      />
                      <div>
                        <p className="font-medium text-[#1F2937]">{user.userName}</p>
                        <p className="text-xs text-[#6B7280]">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      variant="flat"
                      color={user.role === "admin" ? "primary" : "default"}
                    >
                      {user.role === "admin" ? "Admin" : "Vendedor"}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <span className="text-[#6B7280]">{user.group}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-[#6B7280]">{user.sessionsCompleted}</span>
                  </TableCell>
                  <TableCell>
                    {user.role === "seller" ? (
                      <span className={cn("font-semibold", getScoreColor(user.score))}>
                        {user.score}
                      </span>
                    ) : (
                      <span className="text-[#6B7280]">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      variant="flat"
                      color={user.status === "active" ? "success" : "default"}
                    >
                      {user.status === "active" ? "Ativo" : "Inativo"}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button isIconOnly variant="ghost" size="sm">
                          <EllipsisVerticalIcon className="w-5 h-5 text-[#6B7280]" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Ações do usuário">
                        <DropdownItem key="view">Ver perfil</DropdownItem>
                        <DropdownItem key="edit">Editar</DropdownItem>
                        <DropdownItem key="metrics">Ver métricas</DropdownItem>
                        <DropdownItem key="reset">Resetar senha</DropdownItem>
                        <DropdownItem key="deactivate" className="text-danger" >
                          Desativar
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {pages > 1 && (
            <div className="flex w-full justify-center py-4">
              <Pagination
                page={page}
                total={pages}
                onChange={setPage}
              />
            </div>
          )}
        </CardBody>
      </Card>

      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        
      >
        <ModalContent>
          <ModalHeader className="border-b border-[#E5E7EB]">
            Adicionar Novo Usuário
          </ModalHeader>
          <ModalBody className="py-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nome completo</label>
                <Input
                  placeholder="Nome do usuário"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">E-mail</label>
                <Input
                  placeholder="email@empresa.com"
                  type="email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Função</label>
                <Select
                  placeholder="Selecione a função"
                  className="w-full"
                  aria-label="Função"
                  classNames={{
                    trigger: "bg-white border border-[#E5E7EB] rounded-xl px-4 py-2.5 hover:border-[#C5D4ED] hover:bg-[#FAFAFA] transition-all duration-200 min-h-[44px]",
                    value: "text-[#1F2937] font-medium",
                  }}
                >
                  <SelectItem key="seller">Vendedor</SelectItem>
                  <SelectItem key="admin">Administrador</SelectItem>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Grupo</label>
                <Select
                  placeholder="Selecione o grupo"
                  className="w-full"
                  aria-label="Grupo"
                  classNames={{
                    trigger: "bg-white border border-[#E5E7EB] rounded-xl px-4 py-2.5 hover:border-[#C5D4ED] hover:bg-[#FAFAFA] transition-all duration-200 min-h-[44px]",
                    value: "text-[#1F2937] font-medium",
                  }}
                >
                  <SelectItem key="comercial">Equipe Comercial</SelectItem>
                  <SelectItem key="inside-sales">Inside Sales</SelectItem>
                  <SelectItem key="enterprise">Enterprise</SelectItem>
                </Select>
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="border-t border-[#E5E7EB]">
            <Button
              variant="ghost"
              onPress={() => setIsAddModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              
              className="bg-[#2E63CD] hover:bg-[#2451A8]"
              onPress={() => setIsAddModalOpen(false)}
            >
              Adicionar Usuário
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
 