import { type WalletApi } from "./api";
import { WalletName } from "./config";

const APIS = {
  [WalletName.NeoLine]: () => import("./neoline"),
  [WalletName.O3]: () => import("./o3"),
  [WalletName.OneGate]: () => import("./onegate"),
  [WalletName.NeonWallet]: () => import("./neonwallet"),
  [WalletName.Vital]: () => import("./onegate"),
  [WalletName["NeoLine(Mobile)"]]: () => import("./onegate"),
};

export async function getWalletApi(walletName: WalletName): Promise<WalletApi> {
  return (await APIS[walletName]()).api;
}
