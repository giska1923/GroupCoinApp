import { apiClient } from '../client';
import { endpoints } from '../endpoints';
import type { UserBalanceDTO, SimplifiedTransferDTO } from '../../types/api';
import { normalizeAmount } from '../../utils/money';
import { resolveCurrency } from '../../config/currency';

type RawCurrencyBalance = { currency?: string; amount?: string | number };
type RawUserBalance = {
  userId?: string;
  user_id?: string;
  user?: UserBalanceDTO['user'];
  balances?: RawCurrencyBalance[];
  netBalance?: number;
  currency?: string;
};

type RawSimplifiedTransfer = {
  fromUserId?: string;
  from_user_id?: string;
  toUserId?: string;
  to_user_id?: string;
  amount?: string | number;
  currency?: string;
};

const normalizeUserBalance = (raw: RawUserBalance): UserBalanceDTO => {
  const userId = String(raw.userId ?? raw.user_id ?? raw.user?.id ?? '');

  if (raw.balances?.length) {
    return {
      userId,
      user: raw.user,
      balances: raw.balances.map(b => ({
        currency: resolveCurrency(b.currency),
        amount: normalizeAmount(b.amount),
      })),
    };
  }

  if (raw.netBalance !== undefined) {
    return {
      userId,
      user: raw.user,
      balances: [
        {
          currency: resolveCurrency(raw.currency),
          amount: normalizeAmount(raw.netBalance),
        },
      ],
    };
  }

  return { userId, user: raw.user, balances: [] };
};

const normalizeTransfer = (raw: RawSimplifiedTransfer): SimplifiedTransferDTO => ({
  fromUserId: String(raw.fromUserId ?? raw.from_user_id ?? ''),
  toUserId: String(raw.toUserId ?? raw.to_user_id ?? ''),
  amount: normalizeAmount(raw.amount),
  currency: resolveCurrency(raw.currency),
});

export const balancesApi = {
  list: (groupId: string) =>
    apiClient
      .get<RawUserBalance[]>(endpoints.groups.balances(groupId))
      .then(r => r.data.map(normalizeUserBalance)),

  simplified: (groupId: string) =>
    apiClient
      .get<RawSimplifiedTransfer[]>(endpoints.groups.simplified(groupId))
      .then(r => r.data.map(normalizeTransfer)),
};
