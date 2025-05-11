export const GetAttributionByIdResponse = {
  type: "object",
  properties: {
    collectionId: {
      type: "string",
      description: "The collection id of the document",
      example: "pbc_1129391060",
    },
    collectionName: {
      type: "string",
      description: "The collection name of the document",
      example: "attributions",
    },
    id: {
      type: "string",
      description: "The id of the attribution",
      example: "m6q41vln04q53dy",
    },
    user_id: {
      type: "string",
      description: "The user id",
      example: "m6q41vln04q53dy",
    },
    document_id: {
      type: "string",
      description: "The document id",
      example: "m6q41vln04q53dy",
    },
    sector: {
      type: "string",
      description: "The sector to evaluate the document to",
      example: "education",
    },
    proposed_budget: {
      type: "number",
      description: "The proposed budget for the document",
      example: 1000000,
    },
    attribution: {
      $ref: "#/components/schemas/EvaluationResponse",
      description: "The attribution data",
    },
    expand: {
      type: "object",
      properties: {
        document_id: {
          $ref: "#/components/schemas/DocumentResponse",
          description: "The document response",
        },
      },
    },
    created: {
      type: "string",
      description: "The date the attribution was created",
      example: "2025-01-18 05:18:46.351Z",
    },
    updated: {
      type: "string",
      description: "The date the attribution was updated",
      example: "2025-01-18 05:18:46.351Z",
    },
  },
};
