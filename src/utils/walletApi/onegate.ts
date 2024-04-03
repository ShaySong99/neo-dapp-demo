import {
  BaseDapi,
  type Dapi,
  type InvokeParams,
  type InvokeResult,
} from "@neongd/neo-dapi";
import { type WalletApi } from "./api";

let neoDapiN3: Dapi;
let onceInit = false;

const init: WalletApi["init"] = async (onUpdate) => {
  if (onceInit) return { neoDapiN3 };
  const neo =
    window.neo ?? window.OneGate ?? window.Vital ?? window.NeoLineMobile;
  if (neo) {
    onceInit = true;
    neoDapiN3 = new BaseDapi(neo);
    setTimeout(() => {
      neo.on("accountChanged", () => {
        void onUpdate();
      });
      neo.on("networkChanged", () => {
        void onUpdate();
      });
    });
    return { neoDapiN3 };
  }
};

async function getAccount() {
  if (onceInit) {
    const account = await neoDapiN3.getAccount();
    return account;
  }
  throw new Error("no connected");
}

async function connect() {
  if (onceInit) {
    const network = await neoDapiN3.getNetworks();
    console.log("network", network);
    const account = await getAccount();
    return {
      ...account,
      network:
        network.defaultNetwork == "MainNet"
          ? "mainnet"
          : network.defaultNetwork == "TestNet"
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
  const result = await neoDapiN3.invoke(params);

  return result;
}

const api: WalletApi = {
  init,
  connect,
  disconnect,
  getAccount,
  invoke,
};

export { api };
