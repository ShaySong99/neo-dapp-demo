import ConnectWallet from "@/components/ConnectModal";
import { WalletContext } from "@/hooks/WalletContext";
import {
  addressToHash,
  decimalToInteger,
  toStandardHex,
} from "@/utils/convertors";
import { getWalletApi } from "@/utils/walletApi";
import Head from "next/head";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

export default function Home() {
  const [walletState] = useContext(WalletContext);

  const [txid, setTxid] = useState<string>();

  const handleTransfer = async () => {
    const GAS_CONTRACT_HASH = "0xd2a4cff31913016155e38e474a2c06d08be276cf";

    if (walletState.connected) {
      const from = addressToHash(walletState.connected.address);
      console.log("from", from);
      const to = from;
      const walletApi = await getWalletApi(walletState.connected.walletName);
      const result = await walletApi.invoke({
        operation: "transfer",
        scriptHash: GAS_CONTRACT_HASH,
        args: [
          { type: "Hash160", value: from },
          { type: "Hash160", value: to },
          {
            type: "Integer",
            value: decimalToInteger("0.1", 8),
          },
          { type: "Any", value: "" },
        ],
        signers: [{ account: from, scopes: "CalledByEntry" }],
        // broadcastOverride: true,
      });
      console.log("Transfer txid", result.txid);
      setTxid(toStandardHex(result.txid));
    }
  };

  useEffect(() => {
    // disconnect
    if (!walletState.connected) {
      setTxid(undefined);
    }
  }, [walletState.connected]);

  return (
    <>
      <Head>
        <title>Neo Dapp Example</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="px-4 py-4 shadow-md sm:px-6 sm:py-6">
          <div className="mx-auto flex w-full max-w-screen-xl flex-wrap items-center justify-between gap-y-4">
            <div className="text-xl">Neo Dapp Example</div>
            <div>
              <ConnectWallet></ConnectWallet>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-screen-xl p-4 sm:p-6">
          <div className="rounded-xl border border-gray-200 p-3">
            <div className="py-2 text-lg">Connected status: </div>
            {walletState.connected ? (
              <>
                <div className="flex space-x-2">
                  <div>{"walletName:"}</div>
                  <div>{walletState.connected.walletName}</div>
                </div>
                <div className="flex space-x-2">
                  <div>{"network:"}</div>
                  <div>{walletState.connected.network}</div>
                </div>
                <div className="flex space-x-2">
                  <div>{"address:"}</div>
                  <p className="min-w-0 break-words">
                    {walletState.connected.address}
                  </p>
                </div>
              </>
            ) : (
              <div>{"No wallet connected"}</div>
            )}
          </div>

          <div className="mt-4 rounded-xl border border-gray-200 p-3">
            {walletState.connected?.network == "mainnet" && (
              <div className="text-red-600">
                {"Recommend to switch testnet. Current network: N3 mainnet"}
              </div>
            )}
            <div className="py-2 text-lg">
              <div>Invoke wallet method:</div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="">Transfer 0.1 GAS To Self:</div>
              <button
                onClick={handleTransfer}
                className="rounded-md border border-slate-400 px-2 hover:cursor-pointer hover:bg-gray-50 active:bg-gray-100"
              >
                Transfer
              </button>
            </div>

            {txid && (
              <div className="flex items-center space-x-3">
                <div>Transaction Result:</div>
                <div className="min-w-0 break-words">{txid}</div>
                <Link
                  className="underline hover:opacity-50"
                  href={`https://testmagnet.explorer.onegate.space/transactionInfo/0x${txid}`}
                  target="_blank"
                >
                  View on Explorer (wait a few seconds)
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
