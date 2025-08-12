import { z } from 'zod';

export const satisfactionLevel = ['좋았어요', '괜찮아요', '아쉬워요'] as const;

export const summarySchema = z
  .object({
    satisfactionLevel: z.enum(satisfactionLevel),
    statisfactionComment: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.satisfactionLevel === '괜찮아요') {
        return true;
      } else {
        return data.statisfactionComment && data.statisfactionComment.length >= 10;
      }
    },
    {
      message: '10자 이상 입력해주세요',
      path: ['statisfactionComment'],
    }
  );

export type SummaryFormValues = z.infer<typeof summarySchema>;

export const detailSchema = z.object({
  detailComment: z.array(z.string()).optional(),
});

export type DetailFormValues = z.infer<typeof detailSchema>;

export const reviewSchema = z.object({
  reviewComment: z.string().min(5, { message: '자세한 후기를 작성해주세요' }),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;

export type EscortReviewFormValues = SummaryFormValues & DetailFormValues & ReviewFormValues;
