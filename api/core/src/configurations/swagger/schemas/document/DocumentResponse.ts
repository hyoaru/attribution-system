export const DocumentResponse = {
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
    title: {
      type: "string",
      description: "The title of the document",
      example: "2024 Grand Education Plan",
    },
    document: {
      type: "string",
      description: "The document file name",
      example: "m6q41vln04q53dy_the_grand_education_plan.pdf",
    },
    created: {
      type: "string",
      description: "The date the document was created",
      example: "2025-01-18 05:18:46.351Z",
    },
    updated: {
      type: "string",
      description: "The date the document was updated",
      example: "2025-01-18 05:18:46.351Z",
    },
  },
};
