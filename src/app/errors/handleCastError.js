export const handleCastError = (error) => {
  const value = error.value;
  const statusCode = 400;

  return {
    statusCode,
    message: "Invalid ID",
    errorMessage: `${value} is not a valid ID!`,
  };
};
