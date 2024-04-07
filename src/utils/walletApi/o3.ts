import { type InvokeParams, type InvokeResult } from "@neongd/neo-dapi";
import { type WalletApi } from "./api";
import { integerToDecimal } from "../convertors";
import { tx } from "@cityofzion/neon-core";
import o3dapi from "o3-dapi-core";
import o3dapiNeo from "o3-dapi-neo";
import o3dapiNeoN3 from "o3-dapi-neo3";

let neoDapi: any;
let neoDapiN3: any;
let onceInit = false;

const init: WalletApi["init"] = async (onUpdate) => {
  o3dapi.initPlugins([o3dapiNeo, o3dapiNeoN3]);
  neoDapi = o3dapi.NEO;
  neoDapiN3 = o3dapi.NEO3;

  return new Promise((resolve) => {
    if (onceInit) {
      resolve({
        neoDapi,
        neoDapiN3,
      });
    }
    const onReady = async () => {
      if (onceInit) {
        resolve({
          neoDapi,
          neoDapiN3,
        });
      }
      try {
        onceInit = true;

        neoDapi.addEventListener(
          neoDapi.Constants.EventName.ACCOUNT_CHANGED,
          onUpdate,
        );
        neoDapi.addEventListener(
          neoDapi.Constants.EventName.NETWORK_CHANGED,
          onUpdate,
        );
        resolve({
          neoDapi,
          neoDapiN3,
        });
      } catch {
        resolve(undefined);
      }
    };

    let neoDapiReady = false;
    let neoDapiN3Ready = false;

    setTimeout(() => {
      if (onceInit) {
        return;
      }
      resolve(undefined);
      alert("O3 Wallet not found");
    }, 1500);

    neoDapi.addEventListener(neoDapi.Constants.EventName.READY, async () => {
      neoDapiReady = true;
      if (neoDapiReady && neoDapiN3Ready) {
        await onReady();
      }
    });

    neoDapiN3.addEventListener(neoDapi.Constants.EventName.READY, async () => {
      neoDapiN3Ready = true;
      if (neoDapiReady && neoDapiN3Ready) {
        await onReady();
      }
    });
  });
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
  const result = await neoDapiN3.invoke({
    scriptHash: paramsTransformed.scriptHash,
    operation: paramsTransformed.operation,
    args: paramsTransformed.args,
    signers: paramsTransformed.signers,
  });
  return {
    // when broadcastOverride is true, O3 only return signedTx
    txid:
      result.txid ??
      tx.Transaction.deserialize(result.signedTx as string).hash(),
    nodeUrl: result.nodeUrl,
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
