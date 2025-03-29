import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  sepolia,
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Web3 College',
  projectId: String(process.env.NEXT_PUBLIC_PROJECT_ID),
  chains: [
    sepolia,
  ],
  ssr: true,
});
