import { z } from 'zod';

export const satisfactionLevel = ['좋았어요', '괜찮아요', '아쉬워요'] as const;

export const summarySchema = z
  .object({
    satisfactionLevel: z.enum(satisfactionLevel),
    satisfactionComment: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.satisfactionLevel === '좋았어요') {
        return true;
      }
      return !!data.satisfactionComment && data.satisfactionComment.length > 0;
    },
    {
      message: '10자 이상 입력해주세요',
      path: ['satisfactionComment'],
    }
  )
  .refine(
    (data) => {
      return !!data.satisfactionComment && data.satisfactionComment.length < 100;
    },
    {
      message: '100자 이하로 입력해주세요',
      path: ['satisfactionComment'],
    }
  );

export type SummaryFormValues = z.infer<typeof summarySchema>;

export const detailOption = [
  '친절해요',
  '책임감',
  '소통이 잘돼요',
  '능숙해요',
  '리포트가 자세해요',
  '부축을 잘해요',
  '진료 지식이 많아요',
  '휠체어도 문제 없어요',
] as const;

export const detailSchema = z.object({
  detailComment: z.array(z.enum(detailOption)).max(3, { message: '최대 3개까지 선택할 수 있어요' }),
});

export type DetailFormValues = z.infer<typeof detailSchema>;

export const reviewSchema = z.object({
  reviewComment: z.string().min(1, { message: '자세한 후기를 작성해주세요' }).max(100, {
    message: '100자 이하로 입력해주세요',
  }),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;

export type EscortReviewFormValues = SummaryFormValues & DetailFormValues & ReviewFormValues;
