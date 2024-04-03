import WcSdk, {
  type ContractInvocation,
} from "@cityofzion/wallet-connect-sdk-core";
import { type InvokeParams, type InvokeResult } from "@neongd/neo-dapi";
import { type WalletApi } from "./api";

let wcInstance: WcSdk;
let onceInit = false;

const init: WalletApi["init"] = async (onUpdate) => {
  if (onceInit) {
    return { wcInstance };
  }
  const wcSdk = await WcSdk.init({
    projectId: "10948dc2258f8e94c79334eef331a72f", // // the ID of your project on Wallet Connect website
    relayUrl: "wss://relay.walletconnect.com", // we are using walletconnect's official relay server
    metadata: {
      name: "NeoDappDemo",
      description: "NeoDappDemo",
      url: location.host,
      icons: [`${location.protocol}//${location.host}/favicon.ico`],
    },
  });
  wcInstance = wcSdk;
  await wcSdk.manageSession();
  await wcInstance.connect("neo3:testnet", ["invokeFunction"]);
  onceInit = true;
  return { wcInstance };
};

async function getAccount() {
  if (onceInit && wcInstance.isConnected()) {
    const account = wcInstance.getAccountAddress();
    return { address: account!, label: undefined, publicKey: "TODO" };
  }
  throw new Error("no connected");
}

async function connect() {
  if (onceInit) {
    const network = wcInstance.getChainId();
    console.log(wcInstance.getAccountAddress()); // print the first connected account address
    console.log(wcInstance.getChainId()); // print the first connected account chain info
    console.log(wcInstance.session?.namespaces); // print the blockchain dictionary with methods, accounts and events
    console.log(wcInstance.session?.peer.metadata); // print the wallet metadata
    const account = await getAccount();
    return {
      ...account,
      network:
        network == "neo3:mainnet"
          ? "mainnet"
          : network == "neo3:testnet"
            ? "testnet"
            : undefined,
    };
  }
  throw new Error("no init");
}

async function disconnect() {
  await wcInstance.disconnect();
}

async function invoke(params: InvokeParams): Promise<InvokeResult> {
  const result = await wcInstance.invokeFunction({
    invocations: [
      {
        scriptHash: params.scriptHash,
        operation: params.operation,
        args: params.args,
      } as ContractInvocation,
    ],
    signers: params.signers,
  });

  return {
    txid: result,
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
