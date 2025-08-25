function appendToFormData<T extends Record<string, any>>(
  data: T,
  formData: FormData,
  fileKeys: (keyof T)[] = []
): FormData {
  Object.keys(data).forEach((key) => {
    const typedKey = key as keyof T;

    if (data[typedKey] !== undefined && data[typedKey] !== null) {
      // Check if the key is a file field
      if (fileKeys.includes(typedKey) && typeof data[typedKey] !== "string") {
        formData.append(key, data[typedKey]);
      } else if (!fileKeys.includes(typedKey)) {
        formData.append(key, data[typedKey]);
      }
    }
  });

  return formData;
}
export { appendToFormData };
