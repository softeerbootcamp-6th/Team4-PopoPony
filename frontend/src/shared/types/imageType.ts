import { z } from 'zod';

export const imageSchema = z.object({
  imageUrl: z.string().min(1, { message: '이미지를 선택해주세요' }),
  //   s3_key: z.string().optional(),
  //   md5: z.string().optional(),
});

export type ImageType = z.infer<typeof imageSchema>;
