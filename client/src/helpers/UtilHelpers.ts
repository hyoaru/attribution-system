// utilsHelpers.ts
export const deepClone = <T>(obj: T): T => structuredClone(obj);

export const calculateTotalScore = (data: any[]): number => {
    let total = 0;

    const sumScores = (items: any[]) => {
        items.forEach((item) => {
            total += item.evaluation_score ?? 0;
        });
    };

    data.forEach((evaluation: { evaluation: any[] }) => {
        evaluation.evaluation.forEach((section: { criteria: any[] }) => {
            sumScores(section.criteria);
        });
    });

    return total;
};

export function calculateBudgetAlignment(
    totalScore: number,
    suggestedBudget: number
): number {
    const totalPossibleScore = 20;
    const percentage = (totalScore / totalPossibleScore) * 100;
    const alignedBudget = (percentage / 100) * suggestedBudget;
    return alignedBudget;
}
