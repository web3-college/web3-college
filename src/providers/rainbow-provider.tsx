"use client";

import type React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { createSiweMessage } from "viem/siwe";
import { RainbowKitProvider, createAuthenticationAdapter, RainbowKitAuthenticationProvider, AuthenticationStatus } from "@rainbow-me/rainbowkit";

import { config } from "../wagmi";
import { useEffect, useMemo, useState } from "react";

const queryClient = new QueryClient();

export function RainbowProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthenticationStatus>("unauthenticated");

  const authenticationAdapter = useMemo(
    () =>
      createAuthenticationAdapter({
        getNonce: async () => {
          const response = await fetch("http://localhost:3001/api/v1/auth/nonce", {
            credentials: "include",
          });
          const { data } = await response.json();
          return data.nonce;
        },

        createMessage: ({ nonce, address, chainId }) => {
          return createSiweMessage({
            domain: window.location.host,
            address,
            statement: "Sign in with Ethereum to the app.",
            uri: window.location.origin,
            version: "1",
            chainId,
            nonce,
          });
        },

        verify: async ({ message, signature }) => {
          const res = await fetch("http://localhost:3001/api/v1/auth/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message, signature }),
            credentials: "include",
          });
          const { data } = await res.json();
          setStatus(data.authenticated ? "authenticated" : "unauthenticated");

          return Boolean(data.authenticated);
        },

        signOut: async () => {
          await fetch("http://localhost:3001/api/v1/auth/logout", {
            credentials: "include",
          });
        },
      }),
    []
  );

  useEffect(() => {
    const getSession = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/v1/auth/session", {
          credentials: "include",
        });
        const { data } = await response.json();

        setStatus(data.authenticated ? "authenticated" : "unauthenticated");
      } catch (error) {
        console.error("获取会话失败:", error);
      }
    };

    getSession();
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitAuthenticationProvider adapter={authenticationAdapter} status={status}>
          <RainbowKitProvider {...config}>{children}</RainbowKitProvider>
        </RainbowKitAuthenticationProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
