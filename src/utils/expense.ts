import type { ExpenseDTO, ExpenseSplitDTO } from '../types/api';
import { addAmounts, isZeroAmount, negateAmount, ZERO } from './money';

/** Current user's owed share from expense detail splits. */
export const myOwedShare = (
  splits: ExpenseSplitDTO[] | undefined,
  userId: string | undefined,
): string => {
  if (!userId || !splits?.length) return ZERO;
  return splits.find(s => String(s.userId) === String(userId))?.owedAmount ?? ZERO;
};

/**
 * Signed net for the current user on an expense:
 *  positive → others owe you; negative → you owe; zero → not involved / settled.
 */
export const expenseUserNet = (
  expense: Pick<ExpenseDTO, 'paidBy' | 'amount'>,
  splits: ExpenseSplitDTO[] | undefined,
  userId: string | undefined,
): string => {
  if (!userId) return ZERO;
  const yourShare = myOwedShare(splits, userId);
  if (isZeroAmount(yourShare) && String(expense.paidBy) !== String(userId)) {
    return ZERO;
  }
  if (String(expense.paidBy) === String(userId)) {
    return addAmounts(expense.amount, negateAmount(yourShare));
  }
  return negateAmount(yourShare);
};
