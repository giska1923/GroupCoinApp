import { useMutation } from '@tanstack/react-query';
import { feedbackApi } from '../api/resources';
import type { SubmitFeedbackPayload } from '../types/api';

export const useSubmitFeedback = () =>
  useMutation({
    mutationFn: (body: SubmitFeedbackPayload) => feedbackApi.submit(body),
  });
