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
  minimumVersion: string;
  disabled?: boolean;
  mobileSupport?: boolean;
}

export const WALLET_INFOS: Record<WalletName, WalletInfo> = {
  [WalletName.NeoLine]: {
    name: WalletName.NeoLine,
    image: neolineIcon.src,
    downloadUrl:
      "https://chrome.google.com/webstore/detail/neoline/cphhlgmgameodnhkjdmkpanlelnlohao",
    minimumVersion: "3.4.3",
  },
  [WalletName.O3]: {
    name: WalletName.O3,
    image: o3Icon.src,
    downloadUrl: "https://o3.network/#download",
    minimumVersion: "3.8.4",
  },
  [WalletName.NeonWallet]: {
    name: WalletName.NeonWallet,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    image: neonIcon.src,
    downloadUrl: "https://neon.coz.io/",
    minimumVersion: "2.11.0",
  },
  [WalletName.OneGate]: {
    name: WalletName.OneGate,
    image: onegateIcon.src,
    downloadUrl: "https://onegate.space",
    minimumVersion: "0.0.0",
    mobileSupport: true,
  },
  [WalletName.Vital]: {
    name: WalletName.Vital,
    image: vitalIcon.src,
    downloadUrl:
      "https://chromewebstore.google.com/detail/vital-extension/kelgachjdnblhfikknkhfkhidbdpiokb",
    minimumVersion: "0.0.0",
  },
  [WalletName["NeoLine(Mobile)"]]: {
    name: WalletName["NeoLine(Mobile)"],
    image: neolineIcon.src,
    downloadUrl: " ",
    minimumVersion: "0",
  },
};
