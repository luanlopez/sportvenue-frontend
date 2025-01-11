"use client";

import { useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { authService } from "@/services/auth";
import { showToast } from "@/components/ui/Toast";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { setTokens } from "@/lib/auth/token";

export default function GoogleCallback() {
  const searchParams = useSearchParams();
  const code = useMemo(() => searchParams.get("code"), [searchParams]);
  const hasCalledApi = useRef(false);

  useEffect(() => {
    if (!code || hasCalledApi.current) {
      return;
    }

    const handleGoogleCallback = async () => {
      try {
        hasCalledApi.current = true;
        const response = await authService.googleCallback(code);
        
        if (!response?.accessToken || !response?.refreshToken) {
          throw new Error("Tokens inválidos");
        }

        setTokens(response.accessToken, response.refreshToken);
        window.location.href = "/";
      } catch (error) {
        console.error("Erro no login Google:", error);
        showToast.error(
          "Erro no login",
          "Não foi possível completar o login com o Google"
        );
      }
    };

    handleGoogleCallback();
  }, [code]);

  return <LoadingScreen />;
}
