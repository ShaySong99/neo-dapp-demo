import { wallet } from "@cityofzion/neon-core";
import BigNumber from "bignumber.js";

export function isValidHex(hex: string): boolean {
  return typeof hex === "string" && /^(0[xX])?([0-9A-Fa-f]{2})*$/.test(hex);
}

export function toStandardHex(hex: string): string {
  if (!isValidHex(hex)) {
    throw new Error(`Invalid hex string: ${hex}`);
  }
  return hex.replace(/0[xX]/, "").toLowerCase();
}

export function bytesToHex(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("hex");
}

export function hexToBytes(hex: string): Uint8Array {
  return Buffer.from(hex, "hex");
}

export function reverseHex(hex: string): string {
  return bytesToHex(hexToBytes(hex).reverse());
}

export function stringToHex(string: string): string {
  return Buffer.from(string).toString("hex");
}

export function hexToString(hex: string): string {
  return Buffer.from(hex, "hex").toString();
}

export function stringToBase64(string: string): string {
  return Buffer.from(string).toString("base64");
}

export function base64ToString(hex: string): string {
  return Buffer.from(hex, "base64").toString();
}

export function base64ToHex(hex: string): string {
  return Buffer.from(hex, "base64").toString("hex");
}

export function integerToDecimal(integer: string, unit: number): string | null {
  if (new BigNumber(integer).isNaN()) {
    return null;
  }
  return new BigNumber(integer).shiftedBy(-unit).toFixed();
}

export function decimalToInteger(decimal: string, unit: number): string | null {
  if (new BigNumber(decimal).isNaN()) {
    return null;
  }
  return new BigNumber(decimal)
    .shiftedBy(unit)
    .dp(0, BigNumber.ROUND_DOWN)
    .toFixed();
}

export function isValidAddress(address: string) {
  return wallet.isAddress(address);
}

export function addressToHash(address: string): string {
  if (!isValidAddress(address)) {
    return "";
  }
  return wallet.getScriptHashFromAddress(address);
}

export function hashToAddress(address: string): string {
  if (address === "") return address;
  return wallet.getAddressFromScriptHash(address);
}
