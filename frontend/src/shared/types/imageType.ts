import { z } from 'zod';

export const imageSchema = z.object({
  imageUrl: z.string().min(1, { message: '이미지를 선택해주세요' }),
});

export type ImageType = z.infer<typeof imageSchema>;
