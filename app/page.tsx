'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWalletContext } from '../context/WalletContext';
import { getNativeXlmBalance } from '../lib/wallet';
import { ArrowRight, ExternalLink, Wallet, Zap } from 'lucide-react';

const FREIGHTER_WEBSTORE_URL = 'https://chromewebstore.google.com/detail/freighter/bcacfldlkkdogcmkkibnjlakofdplcbk';

function formatXlm(balance: string | null): string {
  if (!balance) return '0.0000000';
  const value = Number.parseFloat(balance);
  if (Number.isNaN(value)) return balance;
  return value.toFixed(7);
}

export default function DashboardPage() {
  const { publicKey, isConnected, isCorrectNetwork, connect } = useWalletContext();
  const [balance, setBalance] = useState<string | null>(null);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);

  async function handleOpenFreighterExtension() {
    try {
      await connect();
    } catch {
      window.open(FREIGHTER_WEBSTORE_URL, '_blank', 'noopener,noreferrer');
    }
  }

  useEffect(() => {
    if (!publicKey) {
      setBalance(null);
      setBalanceError(null);
      return;
    }

    let cancelled = false;

    async function loadBalance() {
      setLoadingBalance(true);
      setBalanceError(null);
      try {
        const result = await getNativeXlmBalance(publicKey);
        if (!cancelled) {
          setBalance(result.balance);
        }
      } catch (error) {
        if (!cancelled) {
          setBalance(null);
          setBalanceError(error instanceof Error ? error.message : 'Failed to load balance');
        }
      } finally {
        if (!cancelled) {
          setLoadingBalance(false);
        }
      }
    }

    void loadBalance();

    return () => {
      cancelled = true;
    };
  }, [publicKey]);

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl border border-neutral-800 bg-gradient-to-br from-black via-neutral-950 to-black p-6 shadow-2xl shadow-black/40 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr] lg:items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200/20 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-neutral-200">
              <Zap size={12} />
              Stellar Testnet White Belt
            </div>
            <div className="space-y-3">
              <h1 className="max-w-xl text-4xl font-black tracking-tight text-balance text-white md:text-6xl font-script">
                Splitly
              </h1>
              <p className="max-w-2xl text-base leading-7 text-neutral-300 md:text-lg">
                Connect Freighter, check your native XLM balance, and send a real Stellar Testnet payment with transaction feedback.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/create"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-black transition-colors hover:bg-neutral-200"
              >
                Send XLM
                <ArrowRight size={16} />
              </Link>
              <button
                type="button"
                onClick={handleOpenFreighterExtension}
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-700 bg-neutral-950/70 px-5 py-3 font-semibold text-neutral-200 transition-colors hover:border-neutral-500 hover:bg-neutral-900"
              >
                Freighter Wallet
                <ExternalLink size={16} />
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-black/80 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-3 border-b border-neutral-800 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">Wallet Status</p>
                <p className="mt-1 text-lg font-semibold text-neutral-100">
                  {isConnected ? 'Connected' : 'Not connected'}
                </p>
              </div>
              <div className={`rounded-full px-3 py-1 text-xs font-medium ${isCorrectNetwork ? 'border border-neutral-200/20 bg-white/5 text-neutral-200' : 'border border-neutral-500/20 bg-neutral-900 text-neutral-300'}`}>
                {isCorrectNetwork ? 'Testnet' : 'Check network'}
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">Native balance</p>
                <div className="mt-2 flex items-end gap-2">
                  <Wallet size={18} className="mb-1 text-neutral-200" />
                  {isConnected ? (
                    <span className="text-4xl font-black tracking-tight text-white">
                      {loadingBalance ? '...' : formatXlm(balance)}
                    </span>
                  ) : (
                    <span className="text-2xl font-semibold text-neutral-500">Connect Freighter</span>
                  )}
                  <span className="pb-1 text-sm font-medium text-neutral-400">XLM</span>
                </div>
                {balanceError ? (
                  <p className="mt-2 text-xs text-neutral-400">{balanceError}</p>
                ) : isConnected ? (
                  <p className="mt-2 text-xs text-neutral-500">
                    Balance fetched from Horizon testnet for the connected wallet.
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-neutral-500">
                    Connect Freighter to fetch the wallet balance.
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">Next step</p>
                <p className="mt-1 text-sm text-neutral-300">
                  Open the transfer form to send a testnet payment and capture the transaction hash in the UI.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">1. Connect</p>
          <p className="mt-2 text-sm text-neutral-300">Use Freighter on Stellar Testnet and verify the wallet is connected.</p>
        </div>
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">2. Balance</p>
          <p className="mt-2 text-sm text-neutral-300">Load the connected account's native XLM balance from Horizon.</p>
        </div>
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">3. Send</p>
          <p className="mt-2 text-sm text-neutral-300">Submit a real XLM transaction and show the hash after confirmation.</p>
        </div>
      </section>
    </div>
  );
}
