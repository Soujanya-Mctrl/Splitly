'use client';

import type { Expense } from '../types/index';
import { stroopsToXlm, truncateAddress } from '../lib/stellar-utils';
import { CheckCircle2, Circle } from 'lucide-react';

interface BalanceTableProps {
  expense: Expense;
  currentUser: string | null;
}

export function BalanceTable({ expense, currentUser }: BalanceTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-800 bg-neutral-950/50">
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
              Participant
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-500">
              Amount Owed
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-500">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800">
          {expense.participants.map((participant, i) => {
            const isCurrentUser = participant.address === currentUser;
            return (
              <tr
                key={participant.address}
                className={`transition-colors ${
                  isCurrentUser ? 'bg-white/5' : i % 2 === 0 ? 'bg-neutral-950' : 'bg-neutral-900/50'
                }`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-neutral-200">
                      {truncateAddress(participant.address)}
                    </span>
                    {isCurrentUser && (
                      <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-xs text-neutral-200 border border-white/20">
                        you
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="font-mono font-medium text-neutral-200">
                    {stroopsToXlm(participant.amountOwed)} XLM
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {participant.settled ? (
                    <span className="inline-flex items-center justify-end gap-1.5 text-white">
                      <CheckCircle2 size={14} />
                      <span className="text-xs font-medium">Settled</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-end gap-1.5 text-neutral-400">
                      <Circle size={14} />
                      <span className="text-xs font-medium">Unpaid</span>
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t border-neutral-700 bg-neutral-900/40">
            <td className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Total
            </td>
            <td className="px-4 py-3 text-right font-mono font-bold text-neutral-100">
              {stroopsToXlm(expense.totalAmount)} XLM
            </td>
            <td className="px-4 py-3 text-right text-xs text-neutral-500">
              {expense.participants.filter((p) => p.settled).length}/
              {expense.participants.length} settled
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
