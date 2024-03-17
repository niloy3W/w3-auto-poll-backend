export const handleMongooseError = (error) => {
  const errorIssue = Object.values(error.errors).map((issue) => {
    return issue.message.substring(5);
  });
  const statusCode = 400;
  const errorMessage = errorIssue.join("");

  return {
    statusCode,
    message: "Validation Error",
    errorMessage,
  };
};
