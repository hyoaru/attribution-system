import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Criterion, SubCriterion } from "../types/EvaluationTypes";
import { hasEvaluationResult } from "./EvaluationHelpers";

export const generatePdfReport = (
    modifiedData: any[],
    totalScore: number,
    suggestedBudget: number,
    alignedBudget: number,
    title: string,
    gadEvaluation: string,
    remarksCount: { no: number; partlyYes: number; yes: number }
): void => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(title, doc.internal.pageSize.getWidth() / 2, 15, {
        align: "center",
    });

    // Summary Cards
    const summaryData = [
        [
            `No: ${remarksCount.no}`,
            `Partly Yes: ${remarksCount.partlyYes}`,
            `Yes: ${remarksCount.yes}`,
            `Budget: Php ${alignedBudget.toFixed(2)}`,
        ],
    ];

    autoTable(doc, {
        body: summaryData,
        styles: { fontSize: 10, fontStyle: "bold", halign: "center" },
        theme: "plain",
        margin: { top: 20 },
    });

    const pdfData: any[] = [];
    const columns = [
        "Question/Element",
        "Possible Scores",
        "Actual Score",
        "Evaluation Details",
    ];

    modifiedData.forEach((evaluation) => {
        evaluation.evaluation.forEach(
            (section: {
                name: string;
                criteria: (Criterion | SubCriterion)[];
            }) => {
                pdfData.push([
                    {
                        content: section.name,
                        colSpan: 4,
                        styles: {
                            fillColor: [211, 211, 211],
                            fontStyle: "bold",
                        },
                    },
                    "",
                    "",
                    "",
                ]);

                const processCriteria = (
                    items: (Criterion | SubCriterion)[],
                    level: number = 0
                ) => {
                    items.forEach((item) => {
                        const evaluationDetails = hasEvaluationResult(item)
                            ? `Similarity: ${item.evaluation_result?.highest_cosine_similarity_score.toFixed(
                                  2
                              )}\n` +
                              `Sentence: ${item.evaluation_result?.highest_cosine_similarity_sentence}\n` +
                              `Label: ${item.evaluation_result?.nli_evaluation.label}\n` +
                              `Score: ${item.evaluation_result?.nli_evaluation.score.toFixed(
                                  2
                              )}`
                            : "No evaluation result";

                        pdfData.push([
                            `${"  ".repeat(level)}${item.index} ${
                                item.question
                            }`,
                            item.possible_scores.join(", "),
                            item.evaluation_score,
                            evaluationDetails,
                        ]);

                        if (item.sub_criteria) {
                            processCriteria(item.sub_criteria, level + 1);
                        }
                    });
                };

                processCriteria(section.criteria);
            }
        );
    });

    (doc as any).autoTable({
        head: [columns],
        body: pdfData,
        styles: {
            fontSize: 8,
            cellPadding: 1.5,
            valign: "middle",
        },
        headStyles: {
            fillColor: [243, 244, 246],
            textColor: 0,
            fontStyle: "bold",
        },
        bodyStyles: {
            textColor: 0,
        },
        didParseCell: (data: any) => {
            if (data.row.index === 0 && data.cell.raw?.colSpan) {
                data.cell.styles = data.cell.raw.styles;
                data.cell.content = data.cell.raw.content;
            }
        },
        margin: { top: 30 },
        theme: "grid",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const footerData = [
        [`Proposed Budget: ${suggestedBudget.toFixed(2)}`],
        [`Total Evaluation Score: ${totalScore.toFixed(2)}`],
        [`GAD Evaluation: ${gadEvaluation}`],
        [`Aligned Budget: ${alignedBudget.toFixed(2)}`],
    ];

    autoTable(doc, {
        body: footerData,
        styles: { fontSize: 10, fontStyle: "bold" },
        margin: { top: 10 },
        tableWidth: pageWidth - 40,
        theme: "plain",
    });

    doc.save("evaluation-report.pdf");
};
