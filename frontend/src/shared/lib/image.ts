import type { ImageType, ImageWithPreviewUrl } from '@shared/types';
import CryptoJS from 'crypto-js';

// MD5 checksum 계산 유틸리티 (crypto-js 사용)
export const calculateMD5 = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();

  // ArrayBuffer를 WordArray로 변환
  const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);

  // MD5 해시 계산
  const hash = CryptoJS.MD5(wordArray);

  // Base64로 인코딩하여 반환
  return hash.toString(CryptoJS.enc.Base64);
};

export const removePreviewUrl = (image: ImageWithPreviewUrl): ImageType => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { previewUrl, ...imageData } = image;
  return imageData;
};
