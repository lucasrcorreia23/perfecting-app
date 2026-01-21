"use client";

import { useState } from "react";
import { Button, Checkbox } from "@heroui/react";
import { FormInput } from "@/components/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  EyeIcon, 
  EyeSlashIcon, 
  SparklesIcon, 
  ChartBarIcon, 
  UserGroupIcon,
  CheckCircleIcon 
} from "@heroicons/react/24/outline";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Redirect to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Marketing */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#2E63CD] to-[#1D4185] p-12 flex-col justify-between relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2">
           
            <span className="font-semibold text-2xl text-white">Perfecting</span>
          </Link>
        </div>

        {/* Marketing content */}
        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Transforme seu time de vendas com IA
            </h1>
            <p className="text-lg text-white/80">
              Pratique, aprenda e melhore suas habilidades de vendas com role-plays realistas e feedback instantâneo.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: SparklesIcon, text: "Role-plays com IA avançada" },
              { icon: ChartBarIcon, text: "Métricas detalhadas de progresso" },
              { icon: UserGroupIcon, text: "Gestão completa de equipes" },
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-8">
          <div>
            <div className="text-3xl font-bold text-white">35%</div>
            <div className="text-sm text-white/70">Aumento em conversões</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">10k+</div>
            <div className="text-sm text-white/70">Sessões realizadas</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">500+</div>
            <div className="text-sm text-white/70">Empresas ativas</div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="font-semibold text-2xl text-[#111827]">Perfecting</span>
            </Link>
          </div>

          {/* Form header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#111827] mb-2">Bem-vindo de volta</h2>
            <p className="text-[#6B7280]">Entre com sua conta para continuar treinando</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email field */}
            <FormInput
              id="email"
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onValueChange={setEmail}
              isRequired
            />

            {/* Password field */}
            <FormInput
              id="password"
              label="Senha"
              type={isVisible ? "text" : "password"}
              placeholder="Sua senha"
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

              <div className="flex items-center justify-between pt-1">
                <Checkbox
                  isSelected={rememberMe}
                  onValueChange={setRememberMe}
                  size="sm"
                  classNames={{
                    label: "text-sm text-[#6B7280]",
                  }}
                >
                  Lembrar de mim
                </Checkbox>
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#2E63CD] hover:text-[#2451A8] font-medium transition-colors"
                >
                  Esqueceu a senha?
                </Link>
              </div>

            <Button
              type="submit"
              className="w-full bg-[#2E63CD] hover:bg-[#2451A8] text-white font-medium h-12 mt-6"
              isLoading={isLoading}
            >
              Entrar
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E5E7EB]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-[#6B7280]">ou</span>
            </div>
          </div>

          {/* Sign up link */}
          <div className="text-center">
            <p className="text-sm text-[#6B7280]">
              Não tem uma conta?{" "}
              <Link
                href="/signup"
                className="text-[#2E63CD] hover:text-[#2451A8] font-semibold transition-colors"
              >
                Criar conta gratuita
              </Link>
            </p>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-[#6B7280]">
            Ao continuar, você concorda com nossos{" "}
            <Link href="/terms" className="text-[#2E63CD] hover:underline">
              Termos
            </Link>
            {" "}e{" "}
            <Link href="/privacy" className="text-[#2E63CD] hover:underline">
              Política de Privacidade
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
