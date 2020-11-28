import module from "./wasm/movement_wasm.js";
import wasmFile from "./wasm/movement_wasm.wasm";

export const wasmFunctions = async (a, b) =>
    new Promise(async resolve => {
        const wasm = await fetch(wasmFile);
        const buffer = await wasm.arrayBuffer();
        const _instance = await module({
            wasmBinary: buffer
        });

        return resolve(await _instance)
    });
