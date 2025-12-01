const BANK_API_URL =
  process.env.EXPO_PUBLIC_BANK_API_URL || 'https://2ec5b2bab5fa.ngrok-free.app/api';

export const BANK_API_ENDPOINTS = {
  SIMPLE_REGISTER: `${BANK_API_URL}/simple/register/`,
  SIMPLE_BALANCE: `${BANK_API_URL}/simple/balance/`,
  SIMPLE_TRANSFER: `${BANK_API_URL}/simple/transfer/`,
  SIMPLE_HISTORY: `${BANK_API_URL}/simple/history/`,
};

export type BankAccountSummary = {
  user_id: number;
  email: string;
  account_id: number;
  balance_posted: string;
  balance_pending: string;
  balance_available: string;
};

export type SimplifiedBeneficiary = {
  id: string;
  name: string;
  relation: string;
};

type SimplifiedTransferResponse = {
  transfer_id: string;
  amount: number;
  beneficiary: SimplifiedBeneficiary;
  balance: BankAccountSummary;
};

export type SimplifiedTransferHistoryItem = {
  id: string;
  amount: string;
  timestamp: string;
  direction: 'out' | 'in';
  beneficiary: SimplifiedBeneficiary & { email: string; relation?: string | null };
};

async function request<T>(path: string, options?: RequestInit) {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    ...options,
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      (body && (body.detail || body.error || body.message)) || 'No pudimos contactar al banco.';
    throw new Error(message);
  }
  return body as T;
}

export async function registerBankAccount(input: { email: string; firstName?: string }) {
  return request<BankAccountSummary>(BANK_API_ENDPOINTS.SIMPLE_REGISTER, {
    method: 'POST',
    body: JSON.stringify({
      email: input.email,
      first_name: input.firstName,
    }),
  });
}

export async function fetchBankBalance(identifier: { email?: string; accountId?: number }) {
  const params = new URLSearchParams();
  if (identifier.accountId) {
    params.append('account_id', String(identifier.accountId));
  } else if (identifier.email) {
    params.append('email', identifier.email);
  }
  const url = `${BANK_API_ENDPOINTS.SIMPLE_BALANCE}?${params.toString()}`;
  return request<BankAccountSummary>(url);
}

export async function initiateSimplifiedTransfer(payload: {
  email: string;
  beneficiaryId: string;
  amount: number;
  concept?: string;
}) {
  return request<SimplifiedTransferResponse>(BANK_API_ENDPOINTS.SIMPLE_TRANSFER, {
    method: 'POST',
    body: JSON.stringify({
      email: payload.email,
      beneficiary_id: payload.beneficiaryId,
      amount: payload.amount,
      concept: payload.concept ?? '',
    }),
  });
}

export async function fetchSimplifiedHistory(email: string) {
  const url = `${BANK_API_ENDPOINTS.SIMPLE_HISTORY}?email=${encodeURIComponent(email)}`;
  return request<{ transactions: SimplifiedTransferHistoryItem[] }>(url);
}
