import { type Provider } from "@neongd/neo-dapi";

declare global {
  interface Window {
    NEOLine: any;
    NEOLineN3: any;
    neo?: Provider;
    OneGate?: Provider;
    Vital?: Provider;
    NeoLineMobile?: Provider;
  }
}
