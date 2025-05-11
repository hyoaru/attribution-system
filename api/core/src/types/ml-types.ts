export type NLIEvaluation = {
  label: string; // NLI evaluation label
  score: number; // NLI evaluation score
};

export type EvaluationResult = {
  evaluation_question: string; // The evaluation question
  highest_cosine_similarity_score: number; // Highest cosine similarity score
  highest_cosine_similarity_sentence: string; // Sentence with the highest cosine similarity
  nli_evaluation: NLIEvaluation; // Nested NLI evaluation object
};

export type EndCriteria = {
  index: string; // Index of the end-criteria
  question: string; // The question for the end-criteria
  possible_scores: number[]; // Possible scores for the end-criteria
  evaluation_result: EvaluationResult; // Nested evaluation result
  evaluation_score: number; // Evaluation score for the end-criteria
};

export type SubCriteria = {
  index: string; // Index of the sub-criteria
  question: string; // The question for the sub-criteria
  possible_scores: number[]; // Possible scores for the sub-criteria
  evaluation_result: EvaluationResult; // Nested evaluation result
  evaluation_score: number; // Evaluation score for the sub-criteria
  sub_criteria?: EndCriteria[]; // Optional nested sub-criteria
};

export type Criteria = {
  index: string; // Index of the criteria
  question: string; // The main question for the criteria
  possible_scores: number[]; // Possible scores for the criteria
  sub_criteria?: SubCriteria[]; // Nested sub-criteria
  evaluation_score: number; // Evaluation score for the criteria
};

export type CriteriaSection = {
  name: string; // Name of the project
  criteria: Criteria[]; // List of criteria
  evaluation_score: number; // Evaluation score for the criteria section
};

export type EvaluationResponse = {
  evaluation: CriteriaSection[]; // List of criteria sections
  evaluation_score: number; // Overall evaluation score
};

export type Status = {
  status: string;
  version: string;
};
