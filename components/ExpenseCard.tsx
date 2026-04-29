'use client';

import Link from 'next/link';
import type { Expense } from '../types/index';
import { stroopsToXlm, truncateAddress, formatTimestamp } from '../lib/stellar-utils';
import { ArrowRight, User } from 'lucide-react';

interface ExpenseCardProps {
  expense: Expense;
  currentUser: string | null;
}

export function ExpenseCard({ expense, currentUser }: ExpenseCardProps) {
  const isYourExpense =
    currentUser &&
    (expense.payer === currentUser ||
      expense.participants.some((p) => p.address === currentUser));

  const isOpen = expense.status === 'Open';
  const yourParticipant =
    currentUser && expense.participants.find((p) => p.address === currentUser);

  return (
    <Link
      href={`/expense/${expense.id}`}
      className="group block rounded-xl border border-neutral-800 bg-neutral-950 p-5 transition-all hover:border-neutral-600 hover:bg-neutral-900"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-neutral-100 text-balance leading-snug line-clamp-2 flex-1">
          {expense.description}
        </h3>
        <span
          className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium ${
            isOpen
              ? 'bg-white/10 text-white border border-white/20'
              : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
          }`}
        >
          {isOpen ? 'Open' : 'Closed'}
        </span>
      </div>

      <p className="text-2xl font-bold text-neutral-100 mb-3">
        {stroopsToXlm(expense.totalAmount)}{' '}
        <span className="text-sm font-normal text-neutral-400">XLM</span>
      </p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500 mb-3">
        <span className="flex items-center gap-1">
          <User size={11} />
          <span>Paid by </span>
          <span className="font-mono text-neutral-300">
            {expense.payer === currentUser ? 'you' : truncateAddress(expense.payer)}
          </span>
        </span>
        <span>{expense.participants.length} participant{expense.participants.length !== 1 ? 's' : ''}</span>
        <span>{formatTimestamp(expense.createdAt)}</span>
      </div>

      {isYourExpense && yourParticipant && (
        <div
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            yourParticipant.settled
              ? 'bg-white/10 text-white'
              : 'bg-neutral-900 text-neutral-300'
          }`}
        >
          {yourParticipant.settled
            ? 'Your share settled'
            : `You owe ${stroopsToXlm(yourParticipant.amountOwed)} XLM`}
        </div>
      )}

      <div className="flex items-center justify-end mt-3">
        <span className="text-xs text-neutral-500 group-hover:text-neutral-200 transition-colors flex items-center gap-1">
          View details <ArrowRight size={12} />
        </span>
      </div>
    </Link>
  );
}
