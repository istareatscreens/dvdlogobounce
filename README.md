[![Netlify Status](https://api.netlify.com/api/v1/badges/5cb44389-f5e0-4907-ac9e-d290a50c0c79/deploy-status)](https://app.netlify.com/sites/dvdlogobounce/deploys)

[DVD BOUNCE](https://dvdlogobounce.netlify.app/)

# Compile WASM

Pull the [emscripten image](https://hub.docker.com/r/emscripten/emsdk) then to compile wasm run:
```
docker run \
  --rm \
  -v $(pwd):/src \
  -u $(id -u):$(id -g) \
  emscripten/emsdk \
  emcc movement.c -O3 -s EXPORT_ES6=1 -s USE_ES6_IMPORT_META=0 -s MODULARIZE=1 -s EXPORTED_FUNCTIONS="['_get_canvas_size', '_get_selection','_change_direction','_update_axis','_get_canvas_size', '_get_resize_ratio']" -o movement_wasm.js -O3
```