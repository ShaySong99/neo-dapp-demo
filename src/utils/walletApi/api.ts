import { type Dapi } from "@neongd/neo-dapi";

export interface WalletApi {
  init(onUpdate: () => Promise<void>): Promise<any>;
  connect(): Promise<{
    network?: string;
    address: string;
    publicKey: string;
    label?: string;
  }>;
  disconnect(): Promise<any>;
  getAccount: Dapi["getAccount"];
  invoke: Dapi["invoke"];
}
