const handleZodError = (err) => {
  const errorDetails = { issue: err.issues };
  const statusCode = 400;
  const errorMessage = err.errors
    .map((issue) => `${issue.path[1]} is required`)
    .join(". ");

  return {
    statusCode,
    errorMessage,
    message: "Validation Error",
    errorDetails,
  };
};

export default handleZodError;
