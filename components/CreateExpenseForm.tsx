'use client';

import { useState } from 'react';
import { useWalletContext } from '../context/WalletContext';
import { isValidStellarAddress, truncateAddress } from '../lib/stellar-utils';
import { sendNativeXlmPayment } from '../lib/wallet';
import { TxStatusBanner } from './TxStatusBanner';
import type { TxState } from '../types/index';
import { ArrowRightLeft, Loader2, Send } from 'lucide-react';

const IDLE_TX: TxState = { status: 'idle', txHash: null, error: null };

export function CreateExpenseForm() {
  const { publicKey } = useWalletContext();
  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('');
  const [txState, setTxState] = useState<TxState>(IDLE_TX);

  const parsedAmount = Number(amount);
  const destinationValid = isValidStellarAddress(destination.trim());
  const amountValid = Number.isFinite(parsedAmount) && parsedAmount > 0;
  const canSubmit = Boolean(publicKey) && destinationValid && amountValid && txState.status === 'idle';

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!publicKey || !canSubmit) return;

    setTxState(IDLE_TX);

    try {
      const txHash = await sendNativeXlmPayment({
        sourcePublicKey: publicKey,
        destination: destination.trim(),
        amount: parsedAmount.toFixed(7),
        onStatus: (status) =>
          setTxState((prev) => ({
            ...prev,
            status,
          })),
      });

      setTxState({ status: 'success', txHash, error: null });
      setDestination('');
      setAmount('');
    } catch (error) {
      setTxState({
        status: 'failed',
        txHash: null,
        error: error instanceof Error ? error.message : 'Transaction failed',
      });
    }
  }

  const inFlight =
    txState.status !== 'idle' &&
    txState.status !== 'success' &&
    txState.status !== 'failed';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-neutral-500">
          <ArrowRightLeft size={14} />
          Testnet transfer
        </div>
        <p className="mt-2 text-sm text-neutral-400">
          Send native XLM on Stellar Testnet from <span className="font-mono text-neutral-200">{publicKey ? truncateAddress(publicKey) : 'your wallet'}</span>.
        </p>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="destination" className="block text-sm font-medium text-neutral-300">
          Destination address
        </label>
        <input
          id="destination"
          type="text"
          placeholder="G..."
          value={destination}
          onChange={(event) => setDestination(event.target.value.trimStart())}
          className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2.5 font-mono text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white"
          required
        />
        <p className="text-xs text-neutral-500">
          Enter a valid Stellar public key on testnet.
        </p>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="amount" className="block text-sm font-medium text-neutral-300">
          Amount (XLM)
        </label>
        <input
          id="amount"
          type="number"
          min="0.0000001"
          step="0.0000001"
          placeholder="1.0000000"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white"
          required
        />
        <p className="text-xs text-neutral-500">
          Use up to 7 decimal places, matching Stellar stroop precision.
        </p>
      </div>

      <TxStatusBanner txState={txState} onDismiss={() => setTxState(IDLE_TX)} />

      <button
        type="submit"
        disabled={!canSubmit || inFlight}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 font-semibold text-black transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {inFlight ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send size={16} />
            Send XLM
          </>
        )}
      </button>
    </form>
  );
}
