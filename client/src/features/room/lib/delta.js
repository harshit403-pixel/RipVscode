// Generate a unique identifier for a delta.
export const createDeltaId = () => {

  // Prefer the native UUID generator when available.
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fall back to a timestamp-based identifier.
  return `${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
};

// Convert a single Monaco content change into a backend delta.
// Returns null for no-op changes that should not be sent.
export const createDeltaFromChange = (change, { version, userId }) => {

  // Map the Monaco change geometry onto the backend delta fields.
  const position = change.rangeOffset;
  const length = change.rangeLength;
  const text = change.text;

  // Classify the change as insert, delete, or replace.
  let type;
  if (length === 0 && text.length > 0) {
    type = "insert";
  } else if (length > 0 && text.length === 0) {
    type = "delete";
  } else if (length > 0 && text.length > 0) {
    type = "replace";
  } else {
    return null;
  }

  // Build the delta in the backend's expected shape.
  return {
    id: createDeltaId(),
    userId: userId ?? null,
    version,
    timestamp: Date.now(),
    type,
    position,
    length,
    text,
  };
};
