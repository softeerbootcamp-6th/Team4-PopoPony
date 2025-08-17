import z from 'zod';

export type RecruitStepProps = { handleNextStep?: () => void; handleBackStep?: () => void };

const placeSchema = z.enum(['meeting', 'hospital', 'return']).optional();
export type PlaceType = z.infer<typeof placeSchema>;

export const recruitStepSearchSchema = z.object({
  place: placeSchema,
});
