/**
 * API Data Transfer Objects (DTOs) - Mirror backend DTOs
 * These types should match exactly with the backend API responses
 */

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  contact: string | null;
  role: 'BASIC' | 'MID' | 'PREMIUM';
  notificationsEnabled?: boolean;
  /** True once the user has confirmed ownership of their email. */
  emailVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponseDTO {
  user: UserDTO;
  /** Short-lived bearer token sent on every authenticated request. */
  accessToken: string;
  /** Long-lived token exchanged at /auth/refresh for a new access token. */
  refreshToken: string;
}

/**
 * Returned by registration (and resend) instead of tokens: the account exists
 * but is awaiting email verification. The client must POST the emailed code to
 * /auth/verify-email to obtain a session.
 */
export interface PendingVerificationDTO {
  email: string;
  verificationRequired: boolean;
  message: string;
}

export interface GroupDTO {
  id: string;
  name: string;
  description: string | null;
  currency: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  memberCount?: number;
  expenseCount?: number;
}

export interface GroupMemberDTO {
  id: string;
  userId: string;
  groupId: string;
  role: 'MEMBER' | 'ADMIN' | 'OWNER';
  joinedAt: string;
  createdAt?: string;
  user: UserDTO;
}

export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'REVOKED';

export interface InvitationDTO {
  id: string;
  groupId: string;
  inviterId: string;
  inviteeEmail: string;
  inviteeUserId: string | null;
  role: 'MEMBER' | 'ADMIN';
  status: InvitationStatus;
  expiresAt: string;
  createdAt: string;
  group?: GroupDTO;
  inviter?: UserDTO;
}

export interface GroupDetailDTO {
  group: GroupDTO;
  members: GroupMemberDTO[];
}

export interface ExpenseDTO {
  id: string;
  description: string;
  amount: string;
  currency: string;
  paidBy: string;
  groupId: string;
  expenseDate: string;
  splitType: 'EQUAL' | 'EXACT' | 'PERCENTAGE';
  createdAt: string;
  updatedAt: string;
  paidByUser?: UserDTO;
}

export interface ExpenseDetailDTO {
  expense: ExpenseDTO;
  splits: ExpenseSplitDTO[];
  group?: GroupDTO;
}

export interface ExpenseSplitDTO {
  id: string;
  expenseId: string;
  userId: string;
  owedAmount: string;
  user?: UserDTO;
}

export interface CurrencyBalanceDTO {
  currency: string;
  /** Positive = group owes user; negative = user owes group. */
  amount: string;
}

export interface UserBalanceDTO {
  userId: string;
  user?: UserDTO;
  balances: CurrencyBalanceDTO[];
}

/** @deprecated Use UserBalanceDTO */
export type BalanceDTO = UserBalanceDTO;

export interface SimplifiedTransferDTO {
  fromUserId: string;
  toUserId: string;
  amount: string;
  currency: string;
}

export interface SettlementDTO {
  id: string;
  groupId: string;
  fromUserId: string;
  toUserId: string;
  amount: string;
  currency: string;
  note: string | null;
  settledAt: string;
  createdAt: string;
  fromUser: UserDTO;
  toUser: UserDTO;
}

export interface ActivityDTO {
  id: string;
  type:
    | 'EXPENSE_CREATED'
    | 'EXPENSE_UPDATED'
    | 'EXPENSE_DELETED'
    | 'SETTLEMENT_CREATED'
    | 'MEMBER_JOINED'
    | 'MEMBER_LEFT';
  actorId: string;
  groupId: string | null;
  entityType?: string | null;
  entityId?: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  actor?: UserDTO;
}

export interface ActivityPageDTO {
  items: ActivityDTO[];
  total: number;
  limit: number;
  offset: number;
}

// Request payload types
export interface CreateGroupPayload {
  name: string;
  description?: string;
  /** Mapped to `defaultCurrency` on the API. */
  currency?: string;
  inviteEmails?: string[];
}

export interface UpdateGroupPayload {
  name?: string;
  description?: string;
  /** Mapped to `defaultCurrency` on the API. */
  currency?: string;
}

export interface CreateExpensePayload {
  description: string;
  amount: string; // decimal string like "45.00"
  paidBy?: string;
  currency?: string;
  expenseDate?: string;
  splitType?: 'EQUAL';
  participantIds?: string[];
}

export interface UpdateExpensePayload extends CreateExpensePayload {}

export interface CreateSettlementPayload {
  fromUserId: string;
  toUserId: string;
  amount: string; // decimal string
  note?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  contact?: string;
}

export interface VerifyEmailPayload {
  email: string;
  /** The 6-digit code sent to the user's email. */
  code: string;
}

export interface ResendVerificationPayload {
  email: string;
}

export interface GoogleLoginPayload {
  /** Google OpenID Connect ID token obtained from the native sign-in flow. */
  idToken: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  contact?: string;
  notificationsEnabled?: boolean;
}

export type PushPlatform = 'ios' | 'android';

export interface RegisterDeviceTokenPayload {
  token: string;
  platform: PushPlatform;
}

export interface DeviceTokenDTO {
  id: string;
  userId: string;
  token: string;
  platform: PushPlatform;
  createdAt: string;
}

/** Payload `data` keys the backend should attach to push notifications. */
export type PushNotificationType = 'GROUP_INVITATION' | 'EXPENSE_CREATED';

export interface PushNotificationData {
  type: PushNotificationType;
  groupId?: string;
  invitationId?: string;
  expenseId?: string;
}

export type FeedbackTopic = 'Bug' | 'Feature' | 'General';

export interface SubmitFeedbackPayload {
  topic: FeedbackTopic;
  message: string;
}

export interface FeedbackDTO {
  id: string;
  userId: string;
  topic: FeedbackTopic;
  message: string;
  createdAt: string;
}
