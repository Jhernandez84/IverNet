export function renameFields<T extends object>(
  data: T[],
  fieldMap: Record<string, string>
): Record<string, any>[] {
  return data.map((item) => {
    const newItem: Record<string, any> = {};
    Object.entries(item).forEach(([key, value]) => {
      const newKey = fieldMap[key] || key;
      newItem[newKey] = value;
    });
    return newItem;
  });
}