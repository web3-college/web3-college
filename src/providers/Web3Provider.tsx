"use client"
import { WagmiProvider, createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig, SIWEProvider, SIWEConfig } from "connectkit";
import { AuthService } from "@/api";
import { SiweMessage } from "siwe";

const siweConfig: SIWEConfig = {
  getNonce: async () => {
    console.log('getNonce');

    const response = await AuthService.authControllerGetNonce();
    console.log(response.data);

    return response.data?.nonce || '';
  },
  createMessage: ({ nonce, address, chainId }) => {
    console.log('createMessage');

    const message = new SiweMessage({
      version: '1',
      domain: window.location.host,
      uri: window.location.origin,
      address,
      chainId,
      nonce,
      // Human-readable ASCII assertion that the user will sign, and it must not contain `\n`.
      statement: 'Sign in With Ethereum.',
    }).prepareMessage();

    console.log(message);

    return message;
  },
  verifyMessage: async ({ message, signature }) => {
    console.log('verifyMessage');

    const response = await AuthService.authControllerVerifySignature({
      requestBody: {
        message,
        signature,
      },
    });
    console.log(response.data);

    return typeof response.data === 'boolean' ? response.data : false;
  },
  getSession: async () => {
    console.log('getSession');

    const response = await AuthService.authControllerGetUserInfo();
    console.log(response.data);

    return response.data?.address && response.data?.chainId ? {
      address: response.data?.address as `0x${string}`,
      chainId: response.data?.chainId as number,
    } : null;
  },
  signOut: async () => {
    console.log('signOut');

    const response = await AuthService.authControllerLogout();
    console.log(response.data);

    return response.data?.success as boolean;
  },
}

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [sepolia],
    transports: {
      // RPC URL for each chain
      [sepolia.id]: http(
        `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
      ),
    },
    // Required API Keys
    walletConnectProjectId: process.env.NEXT_PUBLIC_PROJECT_ID || '',
    // Required App Info
    appName: "web3-college",
    // Optional App Info
    appDescription: "web3-college",
  }),
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <SIWEProvider {...siweConfig}>
          <ConnectKitProvider theme="soft">{children}</ConnectKitProvider>
        </SIWEProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};