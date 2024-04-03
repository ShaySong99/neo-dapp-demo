import { type InvokeParams, type InvokeResult } from "@neongd/neo-dapi";
import { type WalletApi } from "./api";
import { integerToDecimal } from "../convertors";
import { tx } from "@cityofzion/neon-core";

let neoDapi: any;
let neoDapiN3: any;
let onceInit = false;

const init: WalletApi["init"] = async (onUpdate) => {
  if (window.NEOLine != null && window.NEOLineN3 != null) {
    if (!onceInit) {
      neoDapi = new window.NEOLine.Init();
      neoDapiN3 = new window.NEOLineN3.Init();
      setTimeout(() => {
        neoDapi.addEventListener(neoDapi.EVENT.ACCOUNT_CHANGED, onUpdate);
        neoDapi.addEventListener(neoDapi.EVENT.NETWORK_CHANGED, onUpdate);
      });

      onceInit = true;
    }
    return {
      neoDapi,
      neoDapiN3,
    };
  }
};

async function getAccount() {
  if (onceInit) {
    const account = await neoDapiN3.getAccount();
    const { publicKey } = await neoDapiN3.getPublicKey();
    return { address: account.address, label: account.label, publicKey };
  }
  throw new Error("no connected");
}

async function connect() {
  if (onceInit) {
    const network = await neoDapi.getNetworks();
    console.log("network", network);
    const account = await getAccount();
    return {
      ...account,
      network:
        network.defaultNetwork == "N3MainNet"
          ? "mainnet"
          : network.defaultNetwork == "N3TestNet"
            ? "testnet"
            : undefined,
    };
  }
  throw new Error("no init");
}

async function disconnect() {
  // todo
}

async function invoke(params: InvokeParams): Promise<InvokeResult> {
  const paramsTransformed = {
    ...params,
    extraSystemFee: params.extraSystemFee
      ? integerToDecimal(params.extraSystemFee, 8)
      : undefined,
    signers: params.signers?.map((signer) => {
      return {
        ...signer,
        scopes: tx.parse(signer.scopes),
      };
    }),
  };
  const result = await neoDapiN3.invoke(paramsTransformed);

  return {
    txid: result.txid,
    nodeUrl: result.nodeURL,
    signedTx: result.signedTx,
  };
}

const api: WalletApi = {
  init,
  connect,
  disconnect,
  getAccount,
  invoke,
};

export { api };
