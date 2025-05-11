export const UpdateAttributionRequest = {
  type: "object",
  properties: {
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
  },
  required: ["sector", "proposed_budget", "attribution"],
};
