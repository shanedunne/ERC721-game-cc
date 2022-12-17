import React, { useState } from "react";
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
import Leaderboard from "./components/Leaderboard";
import Grid from "@mui/material/Grid";

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
  // current account state
  const [currentAccount, setCurrentAccount] = useState("");

  const getAddress = async () => {
    const { ethereum } = window;

    const accounts = await ethereum.request({ method: "eth_accounts" });
    console.log("accounts: ", accounts);

    if (accounts.length > 0) {
      const account = accounts[0];
      console.log("wallet is connected! " + account);
      setCurrentAccount(account);
      console.log("current account is" + currentAccount);
    } else {
      console.log("make sure MetaMask is connected");
    }
  };

  getAddress();
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} coolMode>
        <NavBar />

        <Grid
          container
          spacing={2}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Grid xs={6}>
            <MintCard />
          </Grid>
          <Grid xs={6}>
            <Leaderboard />
          </Grid>
        </Grid>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
