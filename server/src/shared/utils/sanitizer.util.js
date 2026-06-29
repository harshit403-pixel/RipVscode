// Function to sanitize user
export const sanitizeUser = (
  { _id, username, email },
  accessToken
) => {
  return {
    id: _id,
    username,
    email,
    accessToken,
  };
}; 