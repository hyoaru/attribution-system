import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
    TableFooter,
} from "./ui/table";
import {
    Criterion,
    Evaluation,
    ProjectEvaluationTableProps,
    SubCriterion,
} from "@/types/EvaluationTypes";
import {
    calculateTotalScore,
    deepClone,
    calculateBudgetAlignment,
} from "@/helpers/UtilHelpers";
import { getEvaluationDetails, updateParentScores } from "@/helpers/EvaluationHelpers";
import AttributionService from "@/services/AttributionService";

const ProjectEvaluationTable: React.FC<ProjectEvaluationTableProps> = ({
    data,
    suggestedBudget,
    attributionId,
    sector,
    title,
}) => {
    const [modifiedData, setModifiedData] = useState<Evaluation[]>(
        deepClone(data)
    );
    const [totalScore, setTotalScore] = useState<number>(
        calculateTotalScore(modifiedData)
    );
    const [alignedBudget, setAlignedBudget] = useState<number>(0);
    const [isModified, setIsModified] = useState<boolean>(false);
    const [remarksCount, setRemarksCount] = useState({
        no: 0,
        partlyYes: 0,
        yes: 0,
    });

    useEffect(() => {
        const newTotal = calculateTotalScore(modifiedData);
        setTotalScore(newTotal);
    }, [modifiedData]);

    useEffect(() => {
        const budgetAlignment = calculateBudgetAlignment(
            totalScore,
            suggestedBudget
        );
        setAlignedBudget(budgetAlignment);
    }, [totalScore, suggestedBudget]);

    const calculateRemarksCount = (data: Evaluation[]) => {
        let no = 0;
        let partlyYes = 0;
        let yes = 0;

        const traverseCriteria = (criteria: Criterion[] | SubCriterion[]) => {
            criteria.forEach((criterion) => {
                if (criterion.sub_criteria) {
                    traverseCriteria(criterion.sub_criteria);
                } else {
                    const score = criterion.evaluation_score;
                    if (score === criterion.possible_scores[0]) {
                        no++;
                    } else if (score === criterion.possible_scores[1]) {
                        partlyYes++;
                    } else if (score === criterion.possible_scores[2]) {
                        yes++;
                    }
                }
            });
        };

        data.forEach((evaluation) => {
            evaluation.evaluation.forEach((section) => {
                traverseCriteria(section.criteria);
            });
        });

        return { no, partlyYes, yes };
    };

    useEffect(() => {
        const counts = calculateRemarksCount(modifiedData);
        setRemarksCount(counts);
    }, [modifiedData]);

    const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const path = name.split(".").flat();
        const parsedValue = parseFloat(value);
        setIsModified(true);
        if (isNaN(parsedValue)) return;

        setModifiedData((prevData) => {
            const newData = deepClone(prevData);
            let current: any = newData;

            for (let i = 0; i < path.length - 1; i++) {
                const part = path[i];
                current = current[part];
            }

            const lastPart = path[path.length - 1];
            current[lastPart] = parsedValue;

            const updatedData = updateParentScores(newData);
            return updatedData;
        });
    };

    const handleExport = async () => {
        try {
            const details = getEvaluationDetails(modifiedData, title);
            const updates: { cell: string; value: string }[] = [];

            // Add title to C2
            updates.push({ cell: 'C2', value: details.title });

            // Map indexes to specific rows
            const rowMapping: { [key: string]: number } = {
                '1': 8,
                '1.1': 9,
                '1.2': 10,
                '1.3': 11,
                '2': 12,
                '2.1': 13,
                '3': 14,
                '3.1': 15,
                '4': 17,
                '4.1': 18,
                '4.2': 19,
                '5': 20,
                '6': 21,
                '6.1': 22,
                '6.1.1': 23,
                '6.1.2': 24,
                '6.1.3': 25,
                '6.2': 26,
                '6.2.1': 27,
                '6.2.2': 28,
                '6.3': 30,
                '6.3.1': 31,
                '6.3.2': 32,
                '7': 33,
                '8': 35,
                '9': 36,
                '9.1': 37,
                '9.2': 38,
                '10': 39,
                '10.1': 40,
                '10.2': 41,
                '10.3': 42
            };

            // Process items with exact row mapping
            details.items.forEach(item => {
                const indexKey = item.index.toString();
                const row = rowMapping[indexKey];

                if (!row) return; // Skip unmapped items

                // Find first possible score >= evaluation_score
                let scoreIndex = item.possible_scores.findIndex(score =>
                    score >= item.evaluation_score
                );

                if (scoreIndex === -1) scoreIndex = item.possible_scores.length - 1;

                // Map to columns D(0), E(1), F(2)
                ['D', 'E', 'F'].forEach((col, i) => {
                    updates.push({
                        cell: `${col}${row}`,
                        value: i === scoreIndex ? 'YES' : ''
                    });
                });

                // Add actual score to column G
                updates.push({
                    cell: `G${row}`,
                    value: item.evaluation_score.toFixed(2)
                });
            });

            // Add total score to G43
            updates.push({
                cell: 'G43',
                value: details.totalEvaluationScore.toFixed(2)
            });

            // Generate filename from title
            const filename = `${details.title.replace(/[^a-zA-Z0-9]/g, '_')}_checklist.xlsx`;

            // Call the Excel API
            const blob = await AttributionService.fillExcelFile('Checklist', updates);

            // Download the file
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error exporting checklist:', error);
        }


        // generatePdfReport(
        //     modifiedData,
        //     totalScore,
        //     suggestedBudget,
        //     alignedBudget,
        //     title,
        //     getGADLabel(totalScore),
        //     remarksCount
        // );
    };

    // const handleGetSentence = async () => {
    //     const sentences= await getAllHighestCosineSimilaritySentences(modifiedData);
    // };

    const handleUpdate = async () => {
        try {
            if (!modifiedData || modifiedData.length === 0) {
                console.error("No modified data available to update.");
                return;
            }

            const updatedAttribution = {
                sector: sector,
                proposed_budget: suggestedBudget,
                attribution: modifiedData[0],
            };

            await AttributionService.updateAttribution(
                attributionId,
                updatedAttribution
            );
            setIsModified(false);
            console.log("Attribution successfully updated.");
        } catch (error) {
            console.error("Error updating attribution:", error);
        }
    };

    const getGADLabel = (score: number) => {
        if (score < 4.0) return "";
        if (score >= 4.0 && score <= 7.9) return "Promising GAD prospects";
        if (score >= 8.0 && score <= 14.9) return "Gender Sensitive";
        if (score >= 15.0 && score <= 19.9) return "Gender Responsive";
        if (score >= 20.0) return "Fully Gender Responsive";
        return "";
    };

    const renderCriteria = (
        criteria: Criterion[] | SubCriterion[],
        level = 0,
        basePath: string[] = []
    ) => {
        return criteria.map((criterion, idx) => {
            const currentPath = [...basePath, idx.toString()];

            return (
                <React.Fragment key={`criteria-${currentPath.join("-")}`}>
                    <TableRow className={level === 0 ? "bg-gray-100" : ""}>
                        <TableCell className="border border-gray-300 p-2">
                            <div className="flex items-center">
                                <span className="w-12 mr-2">
                                    {criterion.index}
                                </span>
                                <span className="w-full">
                                    {criterion.question}
                                </span>
                            </div>
                        </TableCell>
                        <TableCell className="border border-gray-300 p-2 text-center">
                            {criterion.possible_scores.join(", ")}
                        </TableCell>
                        <TableCell className="border border-gray-300 p-2 text-center">
                            {criterion.sub_criteria ? (
                                <span>{criterion.evaluation_score}</span>
                            ) : (
                                <input
                                    type="number"
                                    value={criterion.evaluation_score}
                                    className="w-full text-center border rounded py-1 px-2"
                                    name={`${currentPath.join(
                                        "."
                                    )}.evaluation_score`}
                                    onChange={handleScoreChange}
                                    step="0.1"
                                    min="0"
                                />
                            )}
                        </TableCell>
                        <TableCell className="border border-gray-300 p-2 text-center">
                            {criterion.evaluation_score ===
                                criterion.possible_scores[0]
                                ? "No"
                                : criterion.evaluation_score ===
                                    criterion.possible_scores[1]
                                    ? "Partly Yes"
                                    : criterion.evaluation_score ===
                                        criterion.possible_scores[2]
                                        ? "Yes"
                                        : "Not Found"}
                        </TableCell>
                        <TableCell className="border border-gray-300 p-2">
                            {"evaluation_result" in criterion &&
                                criterion.evaluation_result ? (
                                <div className="text-sm space-y-1">
                                    <p>
                                        <strong>Similarity Score:</strong>{" "}
                                        {criterion.evaluation_result.highest_cosine_similarity_score.toFixed(
                                            2
                                        )}
                                    </p>
                                    <p>
                                        <strong>Sentence:</strong>{" "}
                                        {
                                            criterion.evaluation_result
                                                .highest_cosine_similarity_sentence
                                        }
                                    </p>
                                    <p>
                                        <strong>Label:</strong>{" "}
                                        {
                                            criterion.evaluation_result
                                                .nli_evaluation.label
                                        }
                                    </p>
                                    <p>
                                        <strong>Inference Score:</strong>{" "}
                                        {criterion.evaluation_result.nli_evaluation.score.toFixed(
                                            2
                                        )}
                                    </p>
                                </div>
                            ) : (
                                <span className="text-gray-500">
                                    No evaluation result
                                </span>
                            )}
                        </TableCell>
                    </TableRow>
                    {criterion.sub_criteria &&
                        renderCriteria(criterion.sub_criteria, level + 1, [
                            ...currentPath,
                            "sub_criteria",
                        ])}
                </React.Fragment>
            );
        });
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <div className="card bg-white border-2 border-black-500 shadow-md p-8 rounded-md">
                    <h1 className="text-lg font-bold text-black-500">No</h1>
                    <p>{remarksCount.no}</p>
                </div>
                <div className="card bg-white border-2 border-black-500 shadow-md p-8 rounded-md">
                    <h1 className="text-lg font-bold text-black-500">
                        Partly Yes
                    </h1>
                    <p>{remarksCount.partlyYes}</p>
                </div>
                <div className="card bg-white border-2 border-black-500 shadow-md p-8 rounded-md">
                    <h1 className="text-lg font-bold text-black-500">Yes</h1>
                    <p>{remarksCount.yes}</p>
                </div>
                <div className="card bg-white border-2 border-black-500 shadow-md p-8 rounded-md">
                    <h1 className="text-lg font-bold text-black-500">Budget</h1>
                    <p>Php {alignedBudget.toFixed(2)}</p>
                </div>
            </div>
            <div className="overflow-x-auto rounded-lg border">
                <h1 className="text-center text-lg font-semibold ">{title}</h1>
                <Table className="w-full">
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableCell className="font-semibold p-2 w-[20%] text-center">
                                Question/Element
                            </TableCell>
                            <TableCell className="font-semibold p-2 w-[20%] text-center">
                                Possible Scores
                            </TableCell>
                            <TableCell className="font-semibold p-2 w-[20%] text-center">
                                Actual Score
                            </TableCell>
                            <TableCell className="font-semibold p-2 w-[20%] text-center">
                                Remarks
                            </TableCell>
                            <TableCell className="font-semibold p-2 w-[20%] text-center">
                                Evaluation Details
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {modifiedData.map((evaluation, evalIndex) =>
                            evaluation.evaluation.map(
                                (section, sectionIndex) => (
                                    <React.Fragment
                                        key={`section-${evalIndex}-${sectionIndex}`}
                                    >
                                        <TableRow className="bg-gray-100">
                                            <TableCell
                                                colSpan={5}
                                                className="p-2 font-semibold"
                                            >
                                                {section.name}
                                            </TableCell>
                                        </TableRow>
                                        {renderCriteria(section.criteria, 0, [
                                            `${evalIndex}`,
                                            "evaluation",
                                            `${sectionIndex}`,
                                            "criteria",
                                        ])}
                                    </React.Fragment>
                                )
                            )
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow className="bg-gray-50">
                            <TableCell colSpan={5} className="p-2 ">
                                <div className="text-lg font-semibold">
                                    Proposed Budget:{" "}
                                    {suggestedBudget.toFixed(2)}
                                </div>
                            </TableCell>
                        </TableRow>
                        <TableRow className="bg-gray-50">
                            <TableCell colSpan={5} className="p-2 ">
                                <div className="flex items-center justify-items-end">
                                    <div className="text-lg font-semibold">
                                        Total Evaluation Score:{" "}
                                        {totalScore.toFixed(2)}
                                    </div>
                                </div>
                                {totalScore >= 4.0 && (
                                    <div className="text-lg font-semibold">
                                        GAD Evaluation:{" "}
                                        {getGADLabel(totalScore)}
                                    </div>
                                )}
                            </TableCell>
                        </TableRow>
                        <TableRow className="bg-gray-50">
                            <TableCell colSpan={5} className="p-2 ">
                                <div className="text-lg font-semibold">
                                    Aligned Budget: {alignedBudget.toFixed(2)}
                                </div>
                            </TableCell>
                        </TableRow>
                        <TableRow className="bg-gray-50">
                            <TableCell colSpan={5} className="p-2">
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleExport}
                                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                                        >
                                            Export Modified Data
                                        </button>

                                        {isModified && (
                                            <button
                                                onClick={handleUpdate}
                                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                                            >
                                                Update
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </div>
    );
};

export default ProjectEvaluationTable;
