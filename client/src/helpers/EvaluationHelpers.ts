// evaluationHelpers.ts
import { Criterion, Evaluation, EvaluationDetails, EvaluationItem, SubCriterion } from "../types/EvaluationTypes";

export const calculateTotalScore = (data: any[]): number => {
    let total = 0;

    // Only sum criteria scores, not sub_criteria
    const sumScores = (items: Criterion[]) => {
        items.forEach((item) => {
            total += item.evaluation_score ?? 0;
        });
    };

    data.forEach((evaluation) => {
        evaluation.evaluation.forEach((section: { criteria: Criterion[] }) => {
            sumScores(section.criteria);
        });
    });

    return total;
};

export const updateParentScores = (data: any[]): any[] => {
    const newData = structuredClone(data);

    const processCriteria = (criteria: (Criterion | SubCriterion)[]) => {
        criteria.forEach((criterion) => {
            if (criterion.sub_criteria && criterion.sub_criteria.length > 0) {
                processCriteria(criterion.sub_criteria);

                const sum = criterion.sub_criteria.reduce(
                    (acc, curr) => acc + (curr.evaluation_score || 0),
                    0
                );

                let closestScore = criterion.possible_scores[0];
                let minDiff = Math.abs(sum - closestScore);
                for (const score of criterion.possible_scores) {
                    const diff = Math.abs(sum - score);
                    if (diff < minDiff) {
                        minDiff = diff;
                        closestScore = score;
                    }
                }

                criterion.evaluation_score = closestScore;
            }
        });
    };

    newData.forEach((evaluation: { evaluation: any[] }) => {
        evaluation.evaluation.forEach(
            (section: { criteria: (Criterion | SubCriterion)[] }) => {
                processCriteria(section.criteria);
            }
        );
    });

    return newData;
};

export const hasEvaluationResult = (
    criterion: Criterion | SubCriterion
): criterion is SubCriterion => {
    return "evaluation_result" in criterion;
};

export function getAllHighestCosineSimilaritySentences(evaluations: Evaluation[]): string[] {
    const sentences: string[] = [];

    function extractSentences(criteria: (Criterion | SubCriterion)[]) {
        for (const criterion of criteria) {
            if ('evaluation_result' in criterion && criterion.evaluation_result?.highest_cosine_similarity_sentence) {
                sentences.push(criterion.evaluation_result.highest_cosine_similarity_sentence);
            }
            if (criterion.sub_criteria) {
                extractSentences(criterion.sub_criteria);
            }
        }
    }

    for (const evaluation of evaluations) {
        for (const section of evaluation.evaluation) {
            extractSentences(section.criteria);
        }
    }

    return sentences;
}

export function getEvaluationDetails(data: Evaluation[], title: string): EvaluationDetails {
    const evaluation = data[0];
    const totalEvaluationScore = evaluation.evaluation_score;

    const items: EvaluationItem[] = [];

    const processCriterion = (criterion: Criterion | SubCriterion) => {
        items.push({
            index: criterion.index,
            evaluation_score: criterion.evaluation_score,
            possible_scores: criterion.possible_scores
        });

        if (criterion.sub_criteria) {
            criterion.sub_criteria.forEach(sub => processCriterion(sub));
        }
    };

    evaluation.evaluation.forEach(section => {
        section.criteria.forEach(criterion => processCriterion(criterion));
    });

    return {
        title,
        totalEvaluationScore,
        items
    };
}