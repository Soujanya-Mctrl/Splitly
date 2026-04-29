'use client';

import { useWalletContext } from '../context/WalletContext';
import { truncateAddress } from '../lib/stellar-utils';
import { Wallet, LogOut, AlertTriangle, Loader2, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export function ConnectWallet() {
  const { publicKey, isConnected, isCorrectNetwork, connect, disconnect } =
    useWalletContext();
  const [connecting, setConnecting] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleConnect() {
    setConnecting(true);
    setConnectError(null);
    try {
      await connect();
    } catch (e) {
      setConnectError(e instanceof Error ? e.message : 'Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  }

  async function handleCopyAddress(address: string) {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }

  if (isConnected && !isCorrectNetwork) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-300">
          <AlertTriangle size={14} />
          <span>Switch to Stellar Testnet in Freighter</span>
        </div>
        <button
          onClick={disconnect}
          className="flex items-center gap-1.5 rounded-lg border border-neutral-700 px-3 py-1.5 text-sm text-neutral-400 transition-colors hover:border-neutral-500 hover:text-neutral-200"
        >
          <LogOut size={14} />
          Disconnect
        </button>
      </div>
    );
  }

  if (isConnected && publicKey) {
    return (
      <div className="flex items-center gap-2">
        <div className="group flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-900/60 px-3 py-1.5 text-sm text-neutral-300">
          <div className="h-2 w-2 rounded-full bg-white" />
          <span className="font-mono text-xs">{truncateAddress(publicKey)}</span>
          <button
            type="button"
            onClick={() => handleCopyAddress(publicKey)}
            className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded text-neutral-400 opacity-0 transition-opacity hover:text-neutral-100 group-hover:opacity-100"
            title={copied ? 'Copied' : 'Copy full address'}
            aria-label={copied ? 'Copied address' : 'Copy full address'}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
          </button>
        </div>
        <button
          onClick={disconnect}
          className="flex items-center gap-1.5 rounded-lg border border-neutral-700 px-3 py-1.5 text-sm text-neutral-400 transition-colors hover:border-neutral-500 hover:text-neutral-200"
          title="Disconnect wallet"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Disconnect</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleConnect}
        disabled={connecting}
        className="flex items-center gap-2 rounded-lg bg-white px-4 py-1.5 text-sm font-medium text-black transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {connecting ? <Loader2 size={14} className="animate-spin" /> : <Wallet size={14} />}
        {connecting ? 'Connecting...' : 'Connect Freighter'}
      </button>
      {connectError && <p className="text-xs text-neutral-400">{connectError}</p>}
    </div>
  );
}
