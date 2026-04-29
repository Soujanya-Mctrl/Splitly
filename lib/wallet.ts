'use client';

import {
  Asset,
  BASE_FEE,
  Horizon,
  Networks,
  Operation,
  TransactionBuilder,
} from '@stellar/stellar-sdk';

export const EXPECTED_PASSPHRASE =
  process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE ?? Networks.TESTNET;
export const HORIZON_URL =
  process.env.NEXT_PUBLIC_HORIZON_URL ?? 'https://horizon-testnet.stellar.org';

export interface WalletInfo {
  publicKey: string;
  networkPassphrase: string;
  isCorrectNetwork: boolean;
}

export interface WalletConnectionInfo extends WalletInfo {}

export interface NativeBalanceInfo {
  balance: string;
  accountExists: boolean;
}

/**
 * Connect to Freighter wallet and return wallet info.
 * Throws if Freighter is not installed or the user rejects access.
 */
export async function connectWallet(): Promise<WalletInfo> {
  // Dynamic import so this only runs in the browser
  const freighter = await import('@stellar/freighter-api');

  const connectedResult = await freighter.isConnected();
  const isConnected =
    typeof connectedResult === 'boolean'
      ? connectedResult
      : (connectedResult as { isConnected: boolean }).isConnected;

  if (!isConnected) {
    throw new Error(
      'Freighter extension not found. Please install it from freighter.app'
    );
  }

  await freighter.requestAccess();
  const pkResult = await freighter.getAddress();
  const publicKey =
    typeof pkResult === 'string'
      ? pkResult
      : (pkResult as { address: string }).address || (pkResult as any).publicKey;

  const details = await freighter.getNetworkDetails();
  const networkPassphrase =
    typeof details === 'string'
      ? details
      : (details as { networkPassphrase: string }).networkPassphrase;

  return {
    publicKey,
    networkPassphrase,
    isCorrectNetwork: networkPassphrase === EXPECTED_PASSPHRASE,
  };
}

/**
 * Check if Freighter is already connected (no user prompt).
 * Returns the public key if connected, or null otherwise.
 */
export async function checkWalletConnection(): Promise<WalletConnectionInfo | null> {
  try {
    const freighter = await import('@stellar/freighter-api');
    const connectedResult = await freighter.isConnected();
    const isConnected =
      typeof connectedResult === 'boolean'
        ? connectedResult
        : (connectedResult as { isConnected: boolean }).isConnected;

    if (!isConnected) return null;

    const pkResult = await freighter.getAddress();
    const publicKey =
      typeof pkResult === 'string'
        ? pkResult
        : (pkResult as { address: string }).address || (pkResult as any).publicKey;

    const details = await freighter.getNetworkDetails();
    const networkPassphrase =
      typeof details === 'string'
        ? details
        : (details as { networkPassphrase: string }).networkPassphrase;

    if (!publicKey) return null;

    return {
      publicKey,
      networkPassphrase,
      isCorrectNetwork: networkPassphrase === EXPECTED_PASSPHRASE,
    };
  } catch {
    return null;
  }
}

export async function getNativeXlmBalance(publicKey: string): Promise<NativeBalanceInfo> {
  const server = new Horizon.Server(HORIZON_URL);
  const account = await server.loadAccount(publicKey);
  const nativeBalance = account.balances.find((balance) => balance.asset_type === 'native');

  return {
    balance: nativeBalance?.balance ?? '0',
    accountExists: true,
  };
}

export async function sendNativeXlmPayment({
  sourcePublicKey,
  destination,
  amount,
  onStatus,
}: {
  sourcePublicKey: string;
  destination: string;
  amount: string;
  onStatus: (status: 'building' | 'awaiting_signature' | 'submitting' | 'polling' | 'success') => void;
}): Promise<string> {
  const server = new Horizon.Server(HORIZON_URL);
  const account = await server.loadAccount(sourcePublicKey);

  onStatus('building');
  const transaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: EXPECTED_PASSPHRASE,
  })
    .addOperation(
      Operation.payment({
        destination,
        asset: Asset.native(),
        amount,
      })
    )
    .setTimeout(30)
    .build();

  onStatus('awaiting_signature');
  const freighter = await import('@stellar/freighter-api');
  const signed = await freighter.signTransaction(transaction.toXDR(), {
    networkPassphrase: EXPECTED_PASSPHRASE,
  });
  const signedXdr =
    typeof signed === 'string'
      ? signed
      : (signed as { signedTxXdr: string }).signedTxXdr;

  onStatus('submitting');
  const submitted = TransactionBuilder.fromXDR(signedXdr, EXPECTED_PASSPHRASE);
  const response = await server.submitTransaction(submitted);

  onStatus('polling');
  if (!response.successful) {
    throw new Error('Transaction was rejected by Horizon');
  }

  onStatus('success');
  return response.hash;
}

/**
 * Sign a transaction XDR string with Freighter.
 */
export async function signTxWithFreighter(
  txXdr: string,
  networkPassphrase: string
): Promise<string> {
  const freighter = await import('@stellar/freighter-api');
  const result = await freighter.signTransaction(txXdr, { networkPassphrase });
  // Handle both old API (returns string) and new API (returns object)
  if (typeof result === 'string') return result;
  return (result as { signedTxXdr: string }).signedTxXdr;
}
