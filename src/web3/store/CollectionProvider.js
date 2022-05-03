import { useReducer } from "react";

import CollectionContext from "./collection-context";

const defaultCollectionState = {
  contract: null,
  totalSupply: null,
  collection: [],
  nftIsLoading: true,
};

const collectionReducer = (state, action) => {
  if (action.type === "CONTRACT") {
    return {
      contract: action.contract,
      totalSupply: state.totalSupply,
      collection: state.collection,
      nftIsLoading: state.nftIsLoading,
    };
  }

  if (action.type === "LOADSUPPLY") {
    return {
      contract: state.contract,
      totalSupply: action.totalSupply,
      collection: state.collection,
      nftIsLoading: state.nftIsLoading,
    };
  }

  if (action.type === "LOADCOLLECTION") {
    return {
      contract: state.contract,
      totalSupply: state.totalSupply,
      collection: action.collection,
      nftIsLoading: state.nftIsLoading,
    };
  }

  if (action.type === "LOADING") {
    return {
      contract: state.contract,
      totalSupply: state.totalSupply,
      collection: state.collection,
      nftIsLoading: action.loading,
    };
  }

  return defaultCollectionState;
};

const CollectionProvider = (props) => {
  const [CollectionState, dispatchCollectionAction] = useReducer(
    collectionReducer,
    defaultCollectionState
  );

  const loadContractHandler = (web3, NFTCollection) => {
    const contract = new web3.eth.Contract(
      NFTCollection.abi,
      NFTCollection.address
    );
    dispatchCollectionAction({ type: "CONTRACT", contract: contract });
    return contract;
  };

  const loadTotalSupplyHandler = async (contract) => {
    const totalSupply = await contract.methods.totalSupply().call();
    dispatchCollectionAction({ type: "LOADSUPPLY", totalSupply: totalSupply });
    return totalSupply;
  };

  const loadCollectionHandler = async (contract, totalSupply) => {
    var collection = [];
    for (var i = 0; i < totalSupply; i++) {
      collection.push({});
    }
    dispatchCollectionAction({
      type: "LOADCOLLECTION",
      collection: collection,
    });

    collection = [];

    for (let i = 0; i < totalSupply; i++) {
      var hash = await contract.methods.tokenURI(i).call();
      hash = hash.replace("ipfs://", "");
      try {
        const response = await fetch(
          `https://ipfs.infura.io/ipfs/${hash}?clear`
        );
        if (!response.ok) {
          throw new Error("Something went wrong");
        }

        const metadata = await response.json();
        const earringTraits = metadata.attributes.filter(
          (e) => e.trait_type == "Earring"
        );
        const backgroundTraits = metadata.attributes.filter(
          (e) => e.trait_type == "Background"
        );
        const furTraits = metadata.attributes.filter(
          (e) => e.trait_type == "Fur"
        );
        const clothesTraits = metadata.attributes.filter(
          (e) => e.trait_type == "Clothes"
        );
        const mouthTraits = metadata.attributes.filter(
          (e) => e.trait_type == "Mouth"
        );
        const eyesTraits = metadata.attributes.filter(
          (e) => e.trait_type == "Eyes"
        );
        const hatTraits = metadata.attributes.filter(
          (e) => e.trait_type == "Hat"
        );

        collection = [
          ...collection,
          {
            id: i,
            image: metadata.image,
            earring: earringTraits.length > 0 ? earringTraits[0].value : "",
            background:
              backgroundTraits.length > 0 ? backgroundTraits[0].value : "",
            fur: furTraits.length > 0 ? furTraits[0].value : "",
            clothes: clothesTraits.length > 0 ? clothesTraits[0].value : "",
            mouth: mouthTraits.length > 0 ? mouthTraits[0].value : "",
            eyes: eyesTraits.length > 0 ? eyesTraits[0].value : "",
            hat: hatTraits.length > 0 ? hatTraits[0].value : "",
          },
        ];
      } catch {
        console.error("Something went wrong");
      }
    }

    dispatchCollectionAction({
      type: "LOADCOLLECTION",
      collection: collection,
    });
  };

  const setNftIsLoadingHandler = (loading) => {
    dispatchCollectionAction({ type: "LOADING", loading: loading });
  };

  const collectionContext = {
    contract: CollectionState.contract,
    totalSupply: CollectionState.totalSupply,
    collection: CollectionState.collection,
    nftIsLoading: CollectionState.nftIsLoading,
    loadContract: loadContractHandler,
    loadTotalSupply: loadTotalSupplyHandler,
    loadCollection: loadCollectionHandler,
    setNftIsLoading: setNftIsLoadingHandler,
  };

  return (
    <CollectionContext.Provider value={collectionContext}>
      {props.children}
    </CollectionContext.Provider>
  );
};

export default CollectionProvider;
