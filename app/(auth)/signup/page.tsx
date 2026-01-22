"use client";

import { useState } from "react";
import { Button, Card, CardBody, Divider, Spinner } from "@heroui/react";
import { FormInput, FormSelect, SelectItem } from "@/components/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

const teamSizes = [
  { value: "1-10", label: "1-10 pessoas" },
  { value: "11-50", label: "11-50 pessoas" },
  { value: "51-200", label: "51-200 pessoas" },
  { value: "201-500", label: "201-500 pessoas" },
  { value: "500+", label: "500+ pessoas" },
];

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate signup
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Redirect to onboarding or dashboard
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="font-semibold text-2xl text-[#111827]">Perfecting</span>
          </Link>
          <p className="mt-3 text-[#6B7280]">Crie sua conta e comece a treinar</p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div
            className={`w-8 h-1 rounded-full ${
              step >= 1 ? "bg-[#2E63CD]" : "bg-[#E5E7EB]"
            }`}
          />
          <div
            className={`w-8 h-1 rounded-full ${
              step >= 2 ? "bg-[#2E63CD]" : "bg-[#E5E7EB]"
            }`}
          />
        </div>

        <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
          <CardBody className="p-8">
            {step === 1 ? (
              <form onSubmit={handleNextStep} className="space-y-6">
                <h2 className="text-lg font-semibold text-[#111827] text-center mb-2">
                  Informações Pessoais
                </h2>

                <FormInput
                  id="name"
                  label="Nome completo"
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onValueChange={setName}
                  isRequired
                />

                <FormInput
                  id="email"
                  label="E-mail corporativo"
                  type="email"
                  placeholder="seu@empresa.com"
                  value={email}
                  onValueChange={setEmail}
                  isRequired
                />

                <FormInput
                  id="company"
                  label="Empresa"
                  type="text"
                  placeholder="Nome da empresa"
                  value={company}
                  onValueChange={setCompany}
                  isRequired
                />

                <FormSelect
                  id="teamSize"
                  label="Tamanho do time de vendas"
                  placeholder="Selecione"
                  selectedKey={teamSize || undefined}
                  onSelectionChange={(key: any) => setTeamSize(key as string)}
                  isRequired
                >
                  {teamSizes.map((size) => (
                    <SelectItem key={size.value}>{size.label}</SelectItem>
                  ))}
                </FormSelect>

                <Button
                  type="submit"
                  className="w-full bg-[#2E63CD] hover:bg-[#2451A8] text-white font-medium rounded-xl shadow-none transition-all duration-200 min-h-[48px] mt-6"
                >
                  Continuar
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-lg font-semibold text-[#111827] text-center mb-2">
                  Crie sua senha
                </h2>

                <FormInput
                  id="password"
                  label="Senha"
                  type={isVisible ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onValueChange={setPassword}
                  endContent={
                    <button
                      type="button"
                      onClick={() => setIsVisible(!isVisible)}
                      className="focus:outline-none"
                      aria-label={isVisible ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {isVisible ? (
                        <EyeSlashIcon className="w-5 h-5 text-[#6B7280]" />
                      ) : (
                        <EyeIcon className="w-5 h-5 text-[#6B7280]" />
                      )}
                    </button>
                  }
                  isRequired
                />

                <FormInput
                  id="confirmPassword"
                  label="Confirmar senha"
                  type={isVisible ? "text" : "password"}
                  placeholder="Repita a senha"
                  value={confirmPassword}
                  onValueChange={setConfirmPassword}
                  isRequired
                  isInvalid={confirmPassword !== "" && password !== confirmPassword}
                  errorMessage={
                    confirmPassword !== "" && password !== confirmPassword
                      ? "As senhas não coincidem"
                      : ""
                  }
                />

                <div className="flex gap-3 mt-6">
                  <Button
                    type="button"
                    variant="bordered"
                    className="flex-1 border-2 border-[#E5E7EB] hover:border-[#D1D5DB] hover:bg-[#F9FAFB] text-[#6B7280] hover:text-[#374151] rounded-xl shadow-none transition-all duration-200 min-h-[48px]"
                    onPress={() => setStep(1)}
                  >
                    Voltar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-[#2E63CD] hover:bg-[#2451A8] text-white font-medium rounded-xl shadow-none transition-all duration-200 min-h-[48px]"
                    isDisabled={isLoading || password !== confirmPassword}
                  >
                    {isLoading && (
                      <Spinner size="sm" color="white" className="mr-2" />
                    )}
                    {isLoading ? "Criando..." : "Criar conta"}
                  </Button>
                </div>
              </form>
            )}

            <Divider className="my-6" />

            <div className="text-center">
              <p className="text-sm text-[#6B7280]">
                Já tem uma conta?{" "}
                <Link
                  href="/login"
                  className="text-[#2E63CD] hover:text-[#2451A8] font-medium transition-colors"
                >
                  Fazer login
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>

        <p className="mt-6 text-center text-xs text-[#6B7280]">
          Ao criar uma conta, você concorda com nossos{" "}
          <Link href="/terms" className="text-[#2E63CD] hover:underline">
            Termos de Serviço
          </Link>{" "}
          e{" "}
          <Link href="/privacy" className="text-[#2E63CD] hover:underline">
            Política de Privacidade
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
