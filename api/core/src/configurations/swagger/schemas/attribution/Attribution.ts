export const NLIEvaluation = {
  type: "object",
  properties: {
    label: {
      type: "string",
      description: "NLI evaluation label",
      example: "entailment",
    },
    score: {
      type: "number",
      description: "NLI evaluation score",
      example: 0.95,
    },
  },
  required: ["label", "score"],
};

export const EvaluationResult = {
  type: "object",
  properties: {
    evaluation_question: {
      type: "string",
      description: "The evaluation question",
      example: "How relevant is the response?",
    },
    highest_cosine_similarity_score: {
      type: "number",
      description: "Highest cosine similarity score",
      example: 0.87,
    },
    highest_cosine_similarity_sentence: {
      type: "string",
      description: "Sentence with the highest cosine similarity",
      example: "This response aligns closely with the expected answer.",
    },
    nli_evaluation: {
      $ref: "#/components/schemas/NLIEvaluation",
    },
  },
  required: [
    "evaluation_question",
    "highest_cosine_similarity_score",
    "highest_cosine_similarity_sentence",
    "nli_evaluation",
  ],
};

export const EndCriteria = {
  type: "object",
  properties: {
    index: {
      type: "string",
      description: "Index of the end-criteria",
      example: "1.1",
    },
    question: {
      type: "string",
      description: "The question for the end-criteria",
      example: "What is the level of clarity?",
    },
    possible_scores: {
      type: "array",
      items: {
        type: "number",
      },
      description: "Possible scores for the end-criteria",
    },
    evaluation_result: {
      $ref: "#/components/schemas/EvaluationResult",
    },
    evaluation_score: {
      type: "number",
      description: "Evaluation score for the end-criteria",
      example: 4.5,
    },
  },
  required: [
    "index",
    "question",
    "possible_scores",
    "evaluation_result",
    "evaluation_score",
  ],
};

export const SubCriteria = {
  type: "object",
  properties: {
    index: {
      type: "string",
      description: "Index of the sub-criteria",
      example: "1.2",
    },
    question: {
      type: "string",
      description: "The question for the sub-criteria",
      example: "How accurate is the response?",
    },
    possible_scores: {
      type: "array",
      items: {
        type: "number",
      },
      description: "Possible scores for the sub-criteria",
    },
    evaluation_result: {
      $ref: "#/components/schemas/EvaluationResult",
    },
    evaluation_score: {
      type: "number",
      description: "Evaluation score for the sub-criteria",
      example: 4.8,
    },
    sub_criteria: {
      type: "array",
      items: {
        $ref: "#/components/schemas/EndCriteria",
      },
      description: "Optional nested sub-criteria",
    },
  },
  required: [
    "index",
    "question",
    "possible_scores",
    "evaluation_result",
    "evaluation_score",
  ],
};

export const Criteria = {
  type: "object",
  properties: {
    index: {
      type: "string",
      description: "Index of the criteria",
      example: "1",
    },
    question: {
      type: "string",
      description: "The main question for the criteria",
      example: "Does this meet the quality standards?",
    },
    possible_scores: {
      type: "array",
      items: {
        type: "integer",
      },
      description: "Possible scores for the criteria",
    },
    sub_criteria: {
      type: "array",
      items: {
        $ref: "#/components/schemas/SubCriteria",
      },
      description: "Sub-criteria associated with the main criteria",
    },
    evaluation_score: {
      type: "number",
      description: "Evaluation score for the criteria",
      example: 4.6,
    },
  },
  required: ["index", "question", "possible_scores", "evaluation_score"],
};

export const CriteriaSection = {
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "Name of the project",
      example: "Project X",
    },
    criteria: {
      type: "array",
      items: {
        $ref: "#/components/schemas/Criteria",
      },
      description: "Criteria associated with the project",
    },
    evaluation_score: {
      type: "number",
      description: "Evaluation score for the criteria section",
      example: 4.7,
    },
  },
  required: ["name", "criteria", "evaluation_score"],
};

export const EvaluationResponse = {
  type: "object",
  properties: {
    evaluation: {
      type: "array",
      items: {
        $ref: "#/components/schemas/CriteriaSection",
      },
      description: "Evaluation of the project",
    },
    evaluation_score: {
      type: "number",
      description: "Evaluation score for the project",
      example: 4.8,
    },
  },
  required: ["evaluation", "evaluation_score"],
};
