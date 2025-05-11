export const SignInRequest = {
  type: "object",
  properties: {
    email: {
      type: "string",
      description: "The user's email address",
      example: "admin@email.com",
    },
    password: {
      type: "string",
      description: "The user's password",
      example: "adminpassword",
    },
  },
  required: ["email", "password"],
};
