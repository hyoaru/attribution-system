export const SignInResponse = {
  type: "object",
  properties: {
    record: {
      type: "object",
      properties: {
        avatar: {
          type: "string",
          description: "The user's avatar",
          example: "https://avatars.githubusercontent.com/u/123456?v=4",
        },
        collectionId: {
          type: "string",
          description: "The collection ID of the user",
          example: "_pb_users_auth_",
        },
        collectionName: {
          type: "string",
          description: "The collection name of the user",
          example: "users",
        },
        created: {
          type: "string",
          description: "The date and time the user was created",
          example: "2025-01-14 07:15:53.639Z",
        },
        email: {
          type: "string",
          description: "The user's email address",
          example: "admin@email.com",
        },
        emailVisibility: {
          type: "boolean",
          description: "Whether the user's email is visible",
          example: false,
        },
        id: {
          type: "string",
          description: "The ID of the user",
          example: "3bre6vwajqrgd89",
        },
        name: {
          type: "string",
          description: "The user's name",
          example: "Admin Admin",
        },
        updated: {
          type: "string",
          description: "The date and time the user was last updated",
          example: "2025-01-14 07:16:02.247Z",
        },
        verified: {
          type: "boolean",
          description: "Whether the user is verified",
          example: true,
        },
      },
    },

    token: {
      type: "string",
      description: "The JWT token for the authenticated user",
      example:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjI1NDU0MDAwLCJleHAiOjE2MjU0NTQwMDAsImlhdCI6MTYyNTQ1NTAwMH0.3p-0s1-1p0-3p1-2p2-4p3-5p4-6p5-7p6-8p7-9p8-0p9-1p10-2p11-3p12-4p13-5p14-6p15",
    },
  },
};
