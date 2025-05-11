import ExcelJS from 'exceljs';
import * as path from 'path';
import { existsSync } from "fs";
const __dirname = path.resolve();

interface UpdateCell {
    cell: string;
    value: any;
}

interface ExcelUpdateRequest {
    sheetName: string;
    updates: UpdateCell[];
}

const cellToRowCol = (cell: string): { row: number; col: number } | null => {
    const match = cell.match(/^([A-Z]+)(\d+)$/i);
    if (!match) return null;

    const [, colLetters, rowStr] = match;
    const row = parseInt(rowStr, 10);
    let col = 0;

    for (let i = 0; i < colLetters.length; i++) {
        col = col * 26 + (colLetters.charCodeAt(i) - "A".charCodeAt(0) + 1);
    }

    return { row, col };
};

export const updateExcelFile = async (
    filePath: string,
    { sheetName, updates }: ExcelUpdateRequest,
    res: any
): Promise<{ success: boolean; message: string }> => {
    try {
        if (!sheetName || !Array.isArray(updates) || updates.length === 0) {
            return { success: false, message: "Missing or invalid required fields" };
        }

        const excelFilePath = path.resolve(__dirname, filePath);

        if (!existsSync(excelFilePath)) {
            return { success: false, message: "File not found" };
        }

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(excelFilePath);

        const sheet = workbook.getWorksheet(sheetName);
        if (!sheet) {
            return { success: false, message: "Sheet not found" };
        }

        updates.forEach(({ cell, value }) => {
            const position = cellToRowCol(cell);
            if (!position) {
                return;
            }

            const { row, col } = position;
            const rowObj = sheet.getRow(row);
            rowObj.getCell(col).value = value;
            rowObj.commit();
        });

        const buffer = await workbook.xlsx.writeBuffer();

        res.setHeader("Content-Disposition", `attachment; filename=updated_${path.basename(filePath)}`);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.send(buffer);

        return { success: true, message: "Cells updated successfully" };
    } catch (error) {
        console.error("Error filling Excel cells:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Unknown error",
        };
    }
};