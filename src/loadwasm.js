import Module from "./wasm/movement_wasm.js";
import addWasm from "./wasm/movement_wasm.wasm";

export const sum = async (a, b) =>
    new Promise(async resolve => {
        const wasm = await fetch(addWasm);
        const buffer = await wasm.arrayBuffer();
        const _instance = await Module({
            wasmBinary: buffer
        });

        return resolve(_instance._add(a, b))
    });
