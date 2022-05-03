import React, { useEffect, useContext } from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AppLayout from "./layout/AppLayout";

import web3 from "./web3/connection/web3";
import Web3Context from "./web3/store/web3-context";
import CollectionContext from "./web3/store/collection-context";
import BaycNftContracts from "./contract-abis/mainnet/bayc-nft-contracts.json";
import { notification } from "antd";

function App() {
  const web3Ctx = useContext(Web3Context);
  const collectionCtx = useContext(CollectionContext);

  useEffect(() => {
    if (!web3) {
      notification["warning"]({
        message: "Warning",
        description:
          "Non-Ethereum browser detected. You should consider trying MetaMask!",
      });
      return;
    }

    window.ethereum.on("chainChanged", (chainId) => {
      window.location.reload();
    });

    const initWeb3 = async () => {
      try {
        await window.ethereum.request({
          method: "eth_requestAccounts",
        });
      } catch (error) {
        notification["error"]({
          message: "Error",
          description: error,
        });
      }

      const account = await web3Ctx.loadAccount(web3);
      const networkId = await web3Ctx.loadNetworkId(web3);
      if (BaycNftContracts.chainId != networkId) {
        notification["error"]({
          message: "Error",
          description: `This network is not supported. Please connect to ${BaycNftContracts.name} in MetaMask!`,
        });
        return;
      }

      const NFTCollection = BaycNftContracts.contracts.BoredApeYachtClub;
      const nftContract = collectionCtx.loadContract(web3, NFTCollection);

      if (nftContract) {
        const totalSupply = await collectionCtx.loadTotalSupply(nftContract);
        collectionCtx.loadCollection(nftContract, Math.min(totalSupply, 20));
      } else {
        window.alert(
          "NFTCollection contract not deployed to detected network."
        );
      }

      collectionCtx.setNftIsLoading(false);

      window.ethereum.on("accountsChanged", (accounts) => {
        web3Ctx.loadAccount(web3);
      });
    };

    initWeb3();
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <AppLayout />
      </div>
    </BrowserRouter>
  );
}

export default App;
