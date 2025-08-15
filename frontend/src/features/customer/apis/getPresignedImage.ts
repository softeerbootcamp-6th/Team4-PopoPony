import { $api } from '@apis';

const getPresignedImage = (imageFileId: number, isEnabled: boolean) => {
  return $api.useQuery(
    'get',
    '/api/images/{imageFileId}/presigned',
    {
      params: {
        path: {
          imageFileId,
        },
      },
    },
    {
      enabled: isEnabled,
    }
  );
};

export default getPresignedImage;
