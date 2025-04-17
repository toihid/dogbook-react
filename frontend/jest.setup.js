import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

if (typeof global.structuredClone === "undefined") {
  global.structuredClone = (val) => {
    if (typeof val === "undefined") return undefined;
    try {
      return JSON.parse(JSON.stringify(val));
    } catch (error) {
      console.warn("structuredClone failed:", error, val);
      return null; // You can throw error instead if needed
    }
  };
}
