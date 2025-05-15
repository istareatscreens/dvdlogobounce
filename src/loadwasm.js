import module from "./wasm/movement_wasm.js";
import wasmFile from "./wasm/movement_wasm.wasm";

let wasmInstance = null;

export const loadWasm = async () => {
    if (wasmInstance) return wasmInstance;

    const wasm = await fetch(wasmFile);
    const buffer = await wasm.arrayBuffer();

    wasmInstance = await module({
        wasmBinary: buffer,
    });

    return wasmInstance;
};

export const getWasmInstance = () => {
    if (!wasmInstance) {
        throw new Error("WASM not loaded yet. Call loadWasm() first.");
    }
    return wasmInstance;
};

export const isWasmLoaded = () => {
    return null !== wasmInstance;
}