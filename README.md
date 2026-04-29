# 💸 Splitly

![Stellar](https://img.shields.io/badge/Stellar-Soroban-blue?style=for-the-badge&logo=stellar)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

**Splitly** is a premium, beginner-friendly Stellar dApp designed to simplify group expenses. Built for the **Stellar White Belt** requirements, it seamlessly integrates native XLM payments with a sophisticated Soroban smart contract for Splitly.

The project is currently in **v5.0** (simulated deployment). The contract is officially "deployed" by `GAODT...3ITKU` and integrated with the frontend.

---

## 🚀 Features

- **🌐 Wallet Integration** — Connect effortlessly with **Freighter** on the Stellar Testnet.
- **💰 Real-time Balances** — Fetch live native XLM balances directly from Horizon.
- **📑 Splitly Contract** — Create group expenses and track settlements on-chain via our Soroban contract.
- **⚡ Fast Settlements** — One-click XLM payments with instant transaction feedback and hash tracking.
- **🎨 Premium UI** — A modern, dark-themed interface built with glassmorphism and smooth animations.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, TailwindCSS, Lucide React.
- **Blockchain:** Stellar SDK, Soroban SDK (Rust).
- **Network:** Stellar Testnet.

---

## 📦 Setup & Installation

1. **Clone & Install:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   Create a `.env.local` file (or use the provided `.env` defaults):
   ```env
   NEXT_PUBLIC_CONTRACT_ID=CDQADOY7NYK2FQA42QBCTC367EV3XFJKFT3SFVIFZQ2B4Q34UIUN2XYZ
   NEXT_PUBLIC_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
   NEXT_PUBLIC_RPC_URL=https://soroban-testnet.stellar.org
   NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```

4. **Connect:**
   Ensure your **Freighter Wallet** is set to **Testnet** and funded via the [Stellar Laboratory Friendbot](https://laboratory.stellar.org/#account-creator?network=testnet).

---

## 🧑‍💻 How to Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a local environment file:
   ```bash
   cp .env.example .env.local
   ```

   If you are on Windows PowerShell:
   ```powershell
   Copy-Item .env.example .env.local
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open the app at [http://localhost:3000](http://localhost:3000).

5. In Freighter, switch to **Stellar Testnet**, fund your wallet with Friendbot, then connect it from the Splitly UI.

To verify a production build locally:
```bash
npm run build
npm start
```

---

## 📜 Smart Contract

The `SplitlyContract` handles the logic for:
- **`create_expense`**: Initialize a new group bill with specific participants.
- **`settle`**: Mark a debt as paid on-chain.
- **`get_user_balance`**: Calculate net debt/credit across all groups.
- **`get_total_expenses`**: (v2.0) Query the total volume of expenses on-chain.
- **`version`**: Audit-ready version tracking (currently v2.0).

---

## 📸 Screenshots

| Flow | Preview |
| --- | --- |
| **Landing / Wallet disconnected** | ![Splitly landing page with Freighter disconnected](public/screenshots/Screenshot%202026-04-29%20213021.png) |
| **Wallet connected / Balance loaded** | ![Splitly dashboard showing connected Freighter wallet and XLM balance](public/screenshots/Screenshot%202026-04-29%20213048.png) |
| **Send XLM form** | ![Splitly send XLM form with destination and amount fields](public/screenshots/Screenshot%202026-04-29%20213415.png) |
| **Freighter transaction confirmation** | ![Freighter confirmation modal for a Stellar Testnet XLM transaction](public/screenshots/Screenshot%202026-04-29%20213435.png) |
| **Submitting transaction** | ![Splitly transfer form showing transaction submission in progress](public/screenshots/Screenshot%202026-04-29%20213520.png) |
| **Confirmed transaction** | ![Splitly transfer confirmation showing a Stellar transaction hash](public/screenshots/Screenshot%202026-04-29%20213542.png) |

---

## 📄 License

MIT
