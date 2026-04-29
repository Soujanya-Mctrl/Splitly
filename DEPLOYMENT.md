# Contract Deployment Guide

Use this guide when deploying a new Splitly Soroban contract and wiring the frontend to it.

## Prerequisites

- Docker Desktop is running.
- You are in the project root:


The Docker image installs the Stellar CLI, Rust, and the `wasm32-unknown-unknown` target, so you do not need to install those locally.

## Optional: Use Your Own Deployer

If you already have a funded Stellar testnet secret key, set it before deployment.

PowerShell:

```powershell
$env:DEPLOYER_SECRET_KEY="S..."
```

Bash:

```bash
export DEPLOYER_SECRET_KEY="S..."
```

If `DEPLOYER_SECRET_KEY` is not set, the deploy script will create and fund a temporary `deployer` identity on testnet inside the container.

## Deploy With Docker Compose

```bash
docker compose up --build deployer
```

This runs:

```bash
scripts/deploy.sh
```

The script will:

1. Build the contract Wasm:

```bash
cargo build --target wasm32-unknown-unknown --release
```

2. Optimize the Wasm:

```bash
stellar contract optimize --wasm contract/target/wasm32-unknown-unknown/release/splitly.wasm
```

3. Deploy to Stellar testnet.

4. Save the new contract ID into `.env`:

```env
NEXT_PUBLIC_CONTRACT_ID=...
NEXT_PUBLIC_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
NEXT_PUBLIC_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
```

## Alternative: Deploy With Script

From Git Bash or WSL:

```bash
bash scripts/docker-run-deploy.sh
```

This builds the `splitly-deploy` Docker image and runs the same deployment script.

## After Deployment

Copy the printed contract ID or read it from `.env`:

```env
NEXT_PUBLIC_CONTRACT_ID=C...
```

Restart the frontend so Next.js picks up the updated public env var:

```bash
npm run dev
```

Then verify the contract in a Stellar testnet contract explorer by loading the contract ID.

## Notes

- `Source code unavailable` or `Build Unverified` in the explorer is normal for this flow. The contract is deployed and usable, but the explorer has not verified public source/build metadata for the Wasm hash.
- Each deployment creates a new contract ID. Update `.env` and restart the frontend after every new deployment.
- The Docker Compose setup caches Cargo dependencies and contract build output in Docker volumes to make later deployments faster.

## Troubleshooting

If Docker appears to hang, check that the deploy container is running the script and not sitting idle:

```bash
docker compose logs deployer
```

If deployment fails because the deployer has no funds, set a funded `DEPLOYER_SECRET_KEY` and rerun:

```powershell
$env:DEPLOYER_SECRET_KEY="S..."
docker compose up --build deployer
```

If the frontend still points to an old contract, restart `npm run dev` after `.env` changes.
