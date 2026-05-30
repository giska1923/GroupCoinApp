import type { ExpenseDTO } from '../types/api';

/**
 * The signed amount (in cents) that an expense changes for `userId`:
 *  - positive  → others owe you (you paid more than your share)
 *  - negative  → you owe (your share exceeds what you paid)
 *  - 0         → not involved / fully settled in this expense
 */
export const expenseUserNet = (
  expense: Pick<ExpenseDTO, 'paidBy' | 'amount' | 'splits'>,
  userId: string | undefined,
): number => {
  if (!userId) return 0;
  const paidByYou = expense.paidBy === userId ? expense.amount : 0;
  const yourShare =
    expense.splits?.find(s => s.userId === userId)?.amount ?? 0;
  return paidByYou - yourShare;
};
