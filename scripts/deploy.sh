#!/usr/bin/env bash
set -euo pipefail

NETWORK="${NETWORK:-testnet}"

echo "Building contract WASM..."
cd contract
cargo build --target wasm32-unknown-unknown --release
cd ..

WASM_PATH="contract/target/wasm32-unknown-unknown/release/splitly.wasm"

echo "Optimizing WASM..."
stellar contract optimize --wasm "$WASM_PATH"
OPTIMIZED="${WASM_PATH%.wasm}.optimized.wasm"

# If no secret key is provided, generate and fund a temporary 'deployer' identity
if [ -z "${DEPLOYER_SECRET_KEY:-}" ]; then
  echo "No DEPLOYER_SECRET_KEY found. Generating a temporary funded account..."
  stellar keys generate --fund deployer --network "$NETWORK" || true
  SOURCE="deployer"
else
  SOURCE="$DEPLOYER_SECRET_KEY"
fi

echo "Deploying to Stellar $NETWORK..."
CONTRACT_ID=$(stellar contract deploy \
  --wasm "$OPTIMIZED" \
  --network "$NETWORK" \
  --source "$SOURCE")

echo "Deployed! Contract ID: $CONTRACT_ID"

# Write to frontend env
cat > .env <<EOF
NEXT_PUBLIC_CONTRACT_ID=$CONTRACT_ID
NEXT_PUBLIC_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
NEXT_PUBLIC_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
EOF

echo "Contract ID saved to .env"
echo "CONTRACT_ID=$CONTRACT_ID"
