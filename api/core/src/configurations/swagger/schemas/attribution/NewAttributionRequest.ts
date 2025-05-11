export const NewAttributionRequest = {
  type: "object",
  properties: {
    sector: {
      type: "string",
      description: "The sector to evaluate the document to",
      example: "education",
    },
    title: {
      type: "string",
      description: "The title of the document",
      example: "2024 Grand Education Plan",
    },
    proposed_budget: {
      type: "number",
      description: "The proposed budget for the document",
      example: 1000000,
    },
    document: {
      type: "string",
      format: "binary",
      description: "The document to upload",
    },
  },
  required: ["sector", "title", "document", "proposed_budget"],
};
