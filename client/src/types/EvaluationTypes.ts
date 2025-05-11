export type EvaluationResult = {
    evaluation_question: string;
    highest_cosine_similarity_score: number;
    highest_cosine_similarity_sentence: string;
    nli_evaluation: {
        label: string;
        score: number;
    };
};

export type SubCriterion = {
    index: number | string;
    question: string;
    possible_scores: number[];
    evaluation_result?: EvaluationResult;
    evaluation_score: number;
    sub_criteria?: SubCriterion[];
};

export type Criterion = {
    index: number | string;
    question: string;
    possible_scores: number[];
    evaluation_score: number;
    sub_criteria?: SubCriterion[];
};

export type Section = {
    name: string;
    criteria: Criterion[];
};

export type Evaluation = {
    evaluation: Section[];
    evaluation_score: number;
};

export type ProjectEvaluationTableProps = {
    data: Evaluation[];
    suggestedBudget: number;
    attributionId: string;
    sector: string;
    title: string;
};

export interface EvaluationItem {
    index: string | number;
    evaluation_score: number;
    possible_scores: number[];
}

export interface EvaluationDetails {
    title: string;
    totalEvaluationScore: number;
    items: EvaluationItem[];
}