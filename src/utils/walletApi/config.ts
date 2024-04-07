import neolineIcon from "@/assets/images/wallet/neoline.png";
import o3Icon from "@/assets/images/wallet/o3.png";
import onegateIcon from "@/assets/images/wallet/onegate.png";
import neonIcon from "@/assets/images/wallet/neon.svg";
import vitalIcon from "@/assets/images/wallet/vital.png";

export enum WalletName {
  NeoLine = "NeoLine",
  O3 = "O3",
  OneGate = "OneGate",
  NeonWallet = "NeonWallet",
  Vital = "Vital",
  "NeoLine(Mobile)" = "NeoLine(Mobile)",
}

export interface WalletInfo {
  name: WalletName;
  image: string;
  downloadUrl: string;
  disabled?: boolean;
}

export const WALLET_INFOS: Record<WalletName, WalletInfo> = {
  [WalletName.NeoLine]: {
    name: WalletName.NeoLine,
    image: neolineIcon.src,
    downloadUrl:
      "https://chrome.google.com/webstore/detail/neoline/cphhlgmgameodnhkjdmkpanlelnlohao",
  },
  [WalletName.O3]: {
    name: WalletName.O3,
    image: o3Icon.src,
    downloadUrl: "https://o3.network/#download",
  },
  [WalletName.NeonWallet]: {
    name: WalletName.NeonWallet,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    image: neonIcon.src,
    downloadUrl: "https://neon.coz.io/",
  },
  [WalletName.OneGate]: {
    name: WalletName.OneGate,
    image: onegateIcon.src,
    downloadUrl: "https://onegate.space",
  },
  [WalletName.Vital]: {
    name: WalletName.Vital,
    image: vitalIcon.src,
    downloadUrl:
      "https://chromewebstore.google.com/detail/vital-extension/kelgachjdnblhfikknkhfkhidbdpiokb",
  },
  [WalletName["NeoLine(Mobile)"]]: {
    name: WalletName["NeoLine(Mobile)"],
    image: neolineIcon.src,
    downloadUrl: " ",
  },
};
