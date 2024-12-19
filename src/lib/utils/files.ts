export type FileWithEncodedData = File & { encodedData: string };

export const getFilesWithEncodedData = async (
  files: File[]
): Promise<FileWithEncodedData[]> => {
  const promises: Array<Promise<FileWithEncodedData>> = [];
  for (const file of files as FileWithEncodedData[]) {
    promises.push(
      new Promise<FileWithEncodedData>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = (e: ProgressEvent<FileReader>) => {
          const encodedData = e.target?.result?.toString() || "";
          file.encodedData = encodedData;
          resolve(file);
        };
        reader.onerror = (error) => {
          console.error(error);
          reject(error);
        };
        reader.readAsDataURL(file);
      })
    );
  }
  const filesWithNullableEncodedData = await Promise.all(promises);
  const filesWithData = filesWithNullableEncodedData.filter((file) => {
    return !!file.encodedData;
  });
  return filesWithData;
};
