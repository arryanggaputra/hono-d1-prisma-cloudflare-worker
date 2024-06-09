// Generic exclude function for a single object
export function excludeObject<
  T extends Record<string, any>,
  Key extends keyof T
>(entity: T, keys: Key[]): Omit<T, Key> {
  // Convert the object into an array of key-value pairs
  const entries = Object.entries(entity) as [Key, T[Key]][];
  // Filter out entries whose keys are in the keys to exclude
  const filteredEntries = entries.filter(([key]) => !keys.includes(key));
  // Convert the filtered entries back into an object
  return Object.fromEntries(filteredEntries) as unknown as Omit<T, Key>;
}

// Generic exclude function for an array of objects or a single object
export function exclude<T extends Record<string, any>, Key extends keyof T>(
  entity: T | T[],
  keys: Key[]
): Omit<T, Key> | Omit<T, Key>[] {
  if (Array.isArray(entity)) {
    // If the entity is an array, map over each item and exclude specified fields
    return entity.map((item) => excludeObject(item, keys));
  } else {
    // If the entity is a single object, exclude specified fields directly
    return excludeObject(entity, keys);
  }
}
