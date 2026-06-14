import { apiClient } from '../client';
import { endpoints } from '../endpoints';
import type { FeedbackDTO, SubmitFeedbackPayload } from '../../types/api';

export const feedbackApi = {
  submit: (body: SubmitFeedbackPayload) =>
    apiClient
      .post<FeedbackDTO>(endpoints.feedback.submit, body)
      .then(r => r.data),
};
