import "./App.css";
import NavBar from "./components/navbar";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  midnightTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { polygonMumbai } from "wagmi/chains";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import MintCard from "./components/Mint";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const { chains, provider } = configureChains(
  [polygonMumbai],
  [alchemyProvider({ alchemyId: process.env.ALCHEMY_ID }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function App() {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <NavBar />
        <MintCard />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
