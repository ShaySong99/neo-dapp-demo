import ModalUnstyled from "./Modal";
import { WALLET_INFOS, type WalletInfo } from "@/utils/walletApi/config";
import Image from "next/image";
import { getWalletApi } from "@/utils/walletApi";
import { useContext, useState } from "react";
import { WalletContext } from "@/hooks/WalletContext";
import { type WalletApi } from "@/utils/walletApi/api";

const walletExtensions = [
  WALLET_INFOS.NeoLine,
  WALLET_INFOS.Vital,
];
const walletDesktop = [WALLET_INFOS.NeonWallet, WALLET_INFOS.O3];
const walletMobile = [WALLET_INFOS.OneGate, WALLET_INFOS.NeoLine];

function WalletItem(props: {
  wallet: WalletInfo;
  onResult: (status: any) => void;
}) {
  const [isLoading, setLoading] = useState(false);
  const [_, dispatch] = useContext(WalletContext);

  const handleConnect = async (wallet: WalletInfo) => {
    try {
      setLoading(true);
      const walletApi = await getWalletApi(wallet.name);
      const result = await walletApi.init(async () => {
        const { address, network } = await walletApi.connect();
        if (address) {
          dispatch({
            type: "connected",
            payload: {
              walletName: wallet.name,
              address,
              network: network,
            },
          });
        }
      });
      if (result) {
        console.log("init wallet", result);
        const { address, network } = await walletApi.connect();
        console.log("address", address);
        if (address) {
          dispatch({
            type: "connected",
            payload: {
              walletName: wallet.name,
              address,
              network: network,
            },
          });
          props.onResult("connected");
        }
      } else {
        props.onResult("initFailed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={() => {
        void handleConnect(props.wallet);
      }}
      className="flex items-center justify-between space-x-4 py-2 hover:cursor-pointer hover:bg-slate-100  sm:px-2"
    >
      <div className="flex space-x-4">
        <div className="h-8 w-8 overflow-hidden rounded-md">
          <Image width={40} height={40} src={props.wallet.image} alt=""></Image>
        </div>
        <div className="text-base sm:text-xl">{props.wallet.name}</div>
      </div>
      {isLoading && <div className="opacity-50">loading...</div>}
    </div>
  );
}

export default function ConnectWallet() {
  const [walletState, dispatch] = useContext(WalletContext);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onConnectResult = (status: any) => {
    if (status === "connected") {
      handleClose();
    }
    if (status === "initFailed") {
      // TODO
    }
  };

  const handleDisconnect = () => {
    dispatch({ type: "connected", payload: undefined });
  };

  return (
    <div>
      {!walletState.connected ? (
        <button
          onClick={handleOpen}
          className="flex h-10 shrink-0 items-center justify-center rounded-xl border border-solid border-slate-400 px-4 hover:bg-gray-50 active:bg-gray-100"
        >
          Connect Wallet
        </button>
      ) : (
        <button
          onClick={handleDisconnect}
          className="flex h-10 shrink-0 items-center justify-center rounded-xl border border-solid border-slate-400 px-4 hover:bg-gray-50 active:bg-gray-100"
        >
          Disconnect
        </button>
      )}
      <ModalUnstyled open={open} handleClose={handleClose}>
        <div>
          <div className="border-b border-gray-300 pb-4 text-xl">
            Connect Wallet
          </div>
          <div className="pt-4">
            <div className="hidden space-y-2 sm:block">
              {[...walletExtensions, ...walletDesktop].map((wallet) => {
                return (
                  <WalletItem
                    key={wallet.name}
                    wallet={wallet}
                    onResult={onConnectResult}
                  />
                );
              })}
            </div>
            <div className="block space-y-2 sm:hidden">
              {walletMobile.map((wallet) => {
                return (
                  <WalletItem
                    key={wallet.name}
                    wallet={wallet}
                    onResult={onConnectResult}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </ModalUnstyled>
    </div>
  );
}
