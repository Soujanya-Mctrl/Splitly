'use client';

import { useEffect } from 'react';
import type { TxState } from '../types/index';
import { Settings, PenLine, Upload, RefreshCw, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';

interface TxStatusBannerProps {
  txState: TxState;
  onDismiss?: () => void;
}

const STAGE_CONFIG: Record<string, { icon: React.ReactNode; label: string; colorClass: string }> = {
  building: {
    icon: <Settings size={16} className="animate-spin" />,
    label: 'Building transaction...',
    colorClass: 'border-neutral-700 bg-neutral-900/80 text-neutral-300',
  },
  awaiting_signature: {
    icon: <PenLine size={16} />,
    label: 'Sign in Freighter...',
    colorClass: 'border-neutral-500/30 bg-neutral-900 text-neutral-200',
  },
  submitting: {
    icon: <Upload size={16} />,
    label: 'Submitting to Stellar...',
    colorClass: 'border-neutral-700 bg-neutral-900/80 text-neutral-300',
  },
  polling: {
    icon: <RefreshCw size={16} className="animate-spin" />,
    label: 'Confirming on-chain...',
    colorClass: 'border-neutral-700 bg-neutral-900/80 text-neutral-300',
  },
  success: {
    icon: <CheckCircle2 size={16} />,
    label: 'Confirmed!',
    colorClass: 'border-white/20 bg-white/5 text-white',
  },
  failed: {
    icon: <XCircle size={16} />,
    label: 'Failed',
    colorClass: 'border-neutral-600 bg-neutral-950 text-neutral-300',
  },
};

export function TxStatusBanner({ txState, onDismiss }: TxStatusBannerProps) {
  const { status, txHash, error } = txState;

  useEffect(() => {
    if (status === 'success' && onDismiss) {
      const timer = setTimeout(onDismiss, 5000);
      return () => clearTimeout(timer);
    }
  }, [status, onDismiss]);

  if (status === 'idle') return null;
  const config = STAGE_CONFIG[status];
  if (!config) return null;

  const expertUrl = txHash ? `https://stellar.expert/explorer/testnet/tx/${txHash}` : null;

  return (
    <div
      className={`mt-3 flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${config.colorClass}`}
      role="status"
      aria-live="polite"
    >
      <span className="mt-0.5 shrink-0">{config.icon}</span>
      <div className="flex-1 min-w-0">
        <span className="font-medium">
          {status === 'failed' && error ? `Failed: ${error}` : config.label}
        </span>
        {status === 'success' && txHash && (
          <div className="mt-1 space-y-1 text-xs">
            <p className="font-mono break-all text-neutral-200">Hash: {txHash}</p>
            {expertUrl && (
              <a
                href={expertUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 underline opacity-75 hover:opacity-100"
              >
                View on Stellar Expert <ExternalLink size={11} />
              </a>
            )}
          </div>
        )}
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="shrink-0 text-current opacity-50 hover:opacity-100" aria-label="Dismiss">
          ×
        </button>
      )}
    </div>
  );
}
