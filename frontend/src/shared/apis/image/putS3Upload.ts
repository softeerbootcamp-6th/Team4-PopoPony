const putS3Upload = async (
  file: File,
  uploadUrl: string,
  headers: Record<string, string>
): Promise<void> => {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers,
    body: file,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
  }
};

export default putS3Upload;
