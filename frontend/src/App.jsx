import React, { useState, useEffect } from "react";
import abi from "./assets/abi.json";
import BigNumber from "bignumber.js";
import "./App.css";
import NavBar from "./components/navbar";
import { ethers } from "ethers";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import MintCard from "./components/Mint";
import LevelUpCard from "./components/LevelUp";
import Leaderboard from "./components/Leaderboard";
import Grid from "@mui/material/Grid";
import axios from "axios";
import { createAppKit } from '@reown/appkit/react'
import { Ethers5Adapter } from '@reown/appkit-adapter-ethers5'
import { baseSepolia } from '@reown/appkit/networks'
import { useAppKitAccount } from "@reown/appkit/react";


// 1. Get projectId
const projectId = import.meta.env.VITE_REOWN_PROJECT_ID;

// 2. Set the networks
const networks = [baseSepolia]

const theme = createTheme({
  palette: {
    primary: {
      light: '#FFC8DD',
      main: '#CDB4DB',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#BDE0FE',
      main: '#A2D2FF',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
});



// 4. Create a AppKit instance
createAppKit({
  adapters: [new Ethers5Adapter()],
  networks,
  projectId,
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  },
  themeMode: 'light'
})



export default function App() {
// contract constants
const contractAddress = "0x3c85bEA24639c001E053e80Ca3A764cDc160cb91";
const contractABI = abi;

// current account state
const [currentAccount, setCurrentAccount] = useState("");
const [hasMinted, setHasMinted] = useState("");
const [name, setName] = useState("");
const [owner, setOwner] = useState("");
const [newName, setNewName] = useState("");
const [tokenId, setTokenId] = useState("");
const [level, setLevel] = useState("");
const [newLevel, setNewLevel] = useState("");
const [players, setPlayers] = useState([]);
const [playersUpdated, setPlayersUpdated] = useState(false);

// to be called when the page is loaded
useEffect(() => {
  getLeaderboard();
}, []);

// call appkit hook to get info on address
const { address, isConnected, caipAddress, status } = useAppKitAccount()


// create is connected function to check if connected to all wallet types

useEffect(() => {
  // get address information every time the isConnected hook updates
  if (isConnected) {
    setCurrentAccount(address);
    getCharacterInfo();
  } else {
    console.log("No wallet connected");
  }
}, [isConnected, address]);


// refactor contract calls when all working correctly
/*
const contractCallSetup = (method) => {
  if(address) {
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );

  }
}
*/

const onNameChange = (event) => {
  setNewName(event.target.value);
  console.log(newName);
};

// add a new player to the leaderboard
const addPlayer = async (newPlayer) => {
  setPlayers([...players, newPlayer]);
};

// update a player's score if they have leveled up
const updatePlayer = (player, key, value) => {
const index = players.indexOf(player);

if (index !== -1) {
  const newPlayers = [...players];
  newPlayers[index] = {
    ...newPlayers[index],
    [key]: value,
  };
  setPlayers(newPlayers);
}
};



const checkIfHasMinted = async () => {
  try {
    const { ethereum } = window;
    if (ethereum) {
      // get provider
      const provider = new ethers.providers.Web3Provider(ethereum);

      // get signer
      const signer = provider.getSigner();
      console.log("address here: " + signer);

      // create address instance
      const verifyMintStatus = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      // get accounts. This has been added again for now as useState does not seem to save quickly enough
      const accounts = await ethereum.request({ method: "eth_accounts" });
      const account = accounts[0];
      console.log("account check" + account);
      const balance = await verifyMintStatus.balanceOf(account);

      if (balance > 0) {
        setHasMinted(true);
        console.log("token ID" + balance);
        getCharacterInfo();
      } else {
        console.log("has not minted - display mint page");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const getCharacterInfo = async () => {
  try {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const getInfo = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      // get accounts. This has been added again for now as useState does not seem to save quickly enough
      const accounts = await ethereum.request({ method: "eth_accounts" });
      const account = accounts[0];
      const characterStructData = await getInfo.ownerAddressToCharacterInfo(
        account
      );
      let charName = characterStructData[0];
      let charTokenId = characterStructData[1];
      let characterLevel = characterStructData[3];

      setName(charName);
      setTokenId(charTokenId);
      setLevel(characterLevel);
      console.log("character info: " + charName + charTokenId + characterLevel)
    }
  } catch (error) {
    console.log(error);
  }
};

const mintCharacter = async (propsName) => {
  try {
    // general ethereum set up
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const minter = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      // get accounts. This has been added again for now as useState does not seem to save quickly enough
      const accounts = await ethereum.request({ method: "eth_accounts" });
      const account = accounts[0];
      console.log("Mint process has begun");

      console.log("character name" + propsName);

      // call mint function

      const newCharacter = await minter.mint(propsName);
      // wait for the transaction to be minee
      await newCharacter.wait();
      console.log(newCharacter.hash);

      // catch player info with event
      await minter.on("PlayerAdded", (owner, characterName, currentLevel) => {
        axios
          .post("http://localhost:3000/players", {
            name: characterName,
            owner: owner,
            score: currentLevel.toString(),
          })
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
        setPlayersUpdated(true);
        console.log("player successfully added");
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const levelUp = async () => {
  try {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const leveler = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      // get accounts. This has been added again for now as useState does not seem to save quickly enough
      const accounts = await ethereum.request({ method: "eth_accounts" });
      const account = accounts[0];

      // call for random words from Chainlink VRF
      const randomNumber = await leveler.requestRandomWords({
        gasLimit: 1000000,
        gasPrice: 30000000000,
      });
      console.log("Level up process has begun");
      console.log("Request sent to Chainlink VRF");

      // Wait for random words to be returned
      await randomNumber.wait();
      console.log(
        "Random number returned. Initiating level up functionality"
      );
      // send the ramdom number from Chainlink VRF through the modulos calculation and add to character
      const levelUpTx = await leveler.getRandomLevelUp({
        gasLimit: 1000000,
        gasPrice: 30000000000,
      });

      console.log("awaiting confirmation was a success");
      await levelUpTx.wait();

      console.log("Level up complete. Checking new level");

      // find out what the characters new level is
      const getLevel = await leveler.ownerAddressToCharacterInfo(account);
      let charName = getLevel[0];
      let newLevel = getLevel[3];
      console.log(`${charName} 's new level is ${newLevel}`);

      console.log("calling leaderboard event listener");
      await leveler.on(
        "LevelUpEvent",
        (owner, characterName, currentLevel) => {
          let updatedPlayer = {
            name: characterName,
            owner: owner,
            score: currentLevel.toString(),
          };
          axios
            .put(
              "http://localhost:3000/players/" + updatedPlayer.owner,
              updatedPlayer
            )
            .then((response) => {
              console.log(response.data);
            })
            .catch((error) => {
              console.log(error);
            });
          setPlayersUpdated(true);
          console.log("player successfully added");
        }
      );
      getLeaderboard();
      console.log("event listener has been called");
    }
  } catch (error) {
    console.log(error);
  }
};

const getLeaderboard = async () => {
  try {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.WebSocketProvider(
        import.meta.env.VITE_ALCHEMY_ID
      );
      const levelCheckInstance = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );
      await levelCheckInstance.on(
        "LevelUpEvent",
        (owner, characterName, currentLevel) => {
          addPlayer({
            name: characterName,
            owner: owner,
            score: currentLevel.toString(),
          });
          console.log("player successfully added");
        }
      );
    }
  } catch (error) {
    console.log(error);
  }
};

return (
        <ThemeProvider theme={theme}>
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
            <Grid item xs={6}>
              {hasMinted ? (
                <LevelUpCard levelUp={levelUp} />
              ) : (
                <MintCard mintCharacter={mintCharacter} />
              )}
            </Grid>
            <Grid item xs={6}>
              <Leaderboard
                playersUpdated={playersUpdated}
                players={players}
                setPlayers={setPlayers}
              />
            </Grid>
          </Grid>
        </ThemeProvider>
)
}