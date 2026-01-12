#!/usr/bin/env bash
set -euo pipefail

# Build Arianna Method DSL core to WebAssembly
# Requires emsdk / emcc (Emscripten)
#
# "the oracle does not predict, it prophesies"

echo "Building arianna_method.c -> WASM..."

emcc arianna_method.c -O2 \
  -s WASM=1 \
  -s MODULARIZE=1 \
  -s EXPORT_NAME="AriannaMethod" \
  -s EXPORTED_FUNCTIONS='["_am_init","_am_exec","_am_get_state","_am_take_jump"]' \
  -s EXPORTED_RUNTIME_METHODS='["ccall","cwrap"]' \
  -o arianna_method.js

echo "Built: arianna_method.js + arianna_method.wasm"
echo ""
echo "To use in browser:"
echo "  import AriannaMethod from './arianna_method.js';"
echo "  const am = await AriannaMethod();"
echo "  am._am_init();"
echo "  am.ccall('am_exec', 'number', ['string'], ['PROPHECY 7\\nDESTINY 0.35']);"
