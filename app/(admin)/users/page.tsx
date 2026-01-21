"use client";

import { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Avatar,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
  Pagination,
} from "@heroui/react";
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
          color="primary"
          className="bg-[#2E63CD] hover:bg-[#2451A8]"
          startContent={<PlusIcon className="w-5 h-5" />}
          onPress={() => setIsAddModalOpen(true)}
        >
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
              onValueChange={setSearchQuery}
              startContent={<MagnifyingGlassIcon className="w-5 h-5 text-[#6B7280]" />}
              variant="bordered"
              className="max-w-sm"
            />

            <div className="flex flex-wrap gap-4">
              <Select
                placeholder="Grupo"
                selectedKeys={[selectedGroup]}
                onSelectionChange={(keys) => setSelectedGroup(Array.from(keys)[0] as string)}
                variant="bordered"
                className="w-44"
                startContent={<FunnelIcon className="w-4 h-4 text-[#6B7280]" />}
              >
                {groups.map((group) => (
                  <SelectItem key={group.value}>{group.label}</SelectItem>
                ))}
              </Select>

              <Select
                placeholder="Status"
                selectedKeys={[selectedStatus]}
                onSelectionChange={(keys) => setSelectedStatus(Array.from(keys)[0] as string)}
                variant="bordered"
                className="w-36"
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
            removeWrapper
            classNames={{
              th: "bg-[#F9FAFB] text-[#6B7280] font-medium",
              td: "py-4",
            }}
            bottomContent={
              pages > 1 ? (
                <div className="flex w-full justify-center py-4">
                  <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={pages}
                    onChange={setPage}
                  />
                </div>
              ) : null
            }
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
                        src={user.userAvatar}
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
                      color={user.role === "admin" ? "secondary" : "default"}
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
                        <Button isIconOnly variant="light" size="sm">
                          <EllipsisVerticalIcon className="w-5 h-5 text-[#6B7280]" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Ações do usuário">
                        <DropdownItem key="view">Ver perfil</DropdownItem>
                        <DropdownItem key="edit">Editar</DropdownItem>
                        <DropdownItem key="metrics">Ver métricas</DropdownItem>
                        <DropdownItem key="reset">Resetar senha</DropdownItem>
                        <DropdownItem key="deactivate" className="text-danger" color="danger">
                          Desativar
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        size="lg"
      >
        <ModalContent>
          <ModalHeader className="border-b border-[#E5E7EB]">
            Adicionar Novo Usuário
          </ModalHeader>
          <ModalBody className="py-6">
            <div className="space-y-4">
              <Input
                label="Nome completo"
                placeholder="Nome do usuário"
                variant="bordered"
                startContent={<UserIcon className="w-5 h-5 text-[#6B7280]" />}
              />
              <Input
                label="E-mail"
                placeholder="email@empresa.com"
                type="email"
                variant="bordered"
                startContent={<EnvelopeIcon className="w-5 h-5 text-[#6B7280]" />}
              />
              <Select
                label="Função"
                placeholder="Selecione a função"
                variant="bordered"
              >
                <SelectItem key="seller">Vendedor</SelectItem>
                <SelectItem key="admin">Administrador</SelectItem>
              </Select>
              <Select
                label="Grupo"
                placeholder="Selecione o grupo"
                variant="bordered"
              >
                <SelectItem key="comercial">Equipe Comercial</SelectItem>
                <SelectItem key="inside-sales">Inside Sales</SelectItem>
                <SelectItem key="enterprise">Enterprise</SelectItem>
              </Select>
            </div>
          </ModalBody>
          <ModalFooter className="border-t border-[#E5E7EB]">
            <Button
              variant="light"
              onPress={() => setIsAddModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              color="primary"
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
 