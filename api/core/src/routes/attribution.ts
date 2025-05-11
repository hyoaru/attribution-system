import { Router, Request, Response } from "express";
import multer from "multer";
import { container } from "../configurations/dependency-injection/container";
import { DI } from "../configurations/dependency-injection/symbols";
import { authMiddleware } from "../middlewares/authMiddleware";
import { AttributionServiceInterface } from "../services/AttributionService/Interface";
import { AuthenticatedRequest } from "../types/globals/AuthenticatedRequest";
import { FileParser } from "../utilities/FileParser";
import { EvaluationResponse } from "../types/ml-types";
import { PocketbaseService } from "../services/PocketbaseService";
import "pdfjs-dist/legacy/build/pdf.worker.js";
import { updateExcelFile } from "../utilities/ExcelFiller";

type NewAttributionRequest = {
  title: string;
  sector: string;
  proposed_budget: number;
};

type GetAllAttributionsRequestQueryParams = {
  sector?: string;
  user_id?: string;
};

type GetAttibutionParams = {
  id: string;
};

type UpdateAttributionParams = {
  id: string;
  sector: string;
  attribution: EvaluationResponse;
  proposed_budget: number;
};

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


async function extractTextFromPDF(pdfBuffer: Buffer): Promise<{ text: string, items: any[] }> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.js");
  const loadingTask = pdfjs.getDocument({ data: pdfBuffer });
  const pdfDocument = await loadingTask.promise;
  let extractedText = "";
  let textItems: any[] = [];

  for (let i = 1; i <= pdfDocument.numPages; i++) {
    const page = await pdfDocument.getPage(i);
    const textContent = await page.getTextContent();
    textContent.items.forEach((item: any) => {
      if (item.str) {
        extractedText += item.str + " ";
        textItems.push({
          text: item.str,
          x: item.transform[4],
          y: item.transform[5],
          width: item.width || 50,
          height: item.height || 10,
          pageIndex: i - 1
        });
      }
    });
  }
  return { text: extractedText.trim(), items: textItems };
}



export const router = Router();

/**
 * @swagger
 * /attributions/{id}:
 *   patch:
 *     summary: Update attribution by ID
 *     description: Update a specific attribution by its unique ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the attribution to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAttributionRequest'
 *     responses:
 *       200:
 *         description: Successful attribution update
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateAttributionResponse'
 *       400:
 *         description: Invalid ID format or request body
 *       404:
 *         description: Attribution not found
 *       500:
 *         description: Internal server error
 */
router.patch(
  "/:id",
  authMiddleware,
  async (req: AuthenticatedRequest<UpdateAttributionParams>, res) => {
    const { id } = req.params;
    const { sector, attribution, proposed_budget } = req.body;

    const attributionService: AttributionServiceInterface =
      container.get<AttributionServiceInterface>(
        DI.AttributionServiceInterface,
      );

    try {
      const updatedAttribution = await attributionService.update({
        id,
        sector,
        attribution,
        proposedBudget: proposed_budget,
      });

      res.status(200).json(updatedAttribution);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({
          message: "Error updating attribution",
          error: error.message,
        });
      } else {
        res.status(500).json({
          message: "Error updating attribution",
          error: "Unknown error",
        });
      }
    }
  },
);

/**
 * @swagger
 * /attributions/{id}:
 *   get:
 *     summary: Get attribution by ID
 *     description: Retrieve a specific attribution by its unique ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the attribution to retrieve
 *     responses:
 *       200:
 *         description: Successful attribution retrieval
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetAttributionByIdResponse'
 *       400:
 *         description: Invalid ID format or query parameters
 *       404:
 *         description: Attribution not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/:id",
  authMiddleware,
  async (req: AuthenticatedRequest<GetAttibutionParams>, res) => {
    const { id } = req.params;

    const attributionService: AttributionServiceInterface =
      container.get<AttributionServiceInterface>(
        DI.AttributionServiceInterface,
      );

    try {
      const attribution = await attributionService.get({ id });
      res.status(200).json(attribution);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res
          .status(500)
          .json({ message: "Error getting attribution", error: error.message });
      } else {
        res.status(500).json({
          message: "Error getting attribution",
          error: "Unknown error",
        });
      }
    }
  },
);

/**
 * @swagger
 * /attributions:
 *   get:
 *     summary: Get all attributions
 *     description: Get all the list of attributions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sector
 *         schema:
 *           type: string
 *         description: Filter attributions by sector
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         description: Filter attributions by user ID
 *     responses:
 *       200:
 *         description: Successful attribution listing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetAllAttributionsResponse'
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.get("/", authMiddleware, async (req: AuthenticatedRequest, res) => {
  const { sector, user_id } = req.query as GetAllAttributionsRequestQueryParams;

  const attributionService: AttributionServiceInterface =
    container.get<AttributionServiceInterface>(DI.AttributionServiceInterface);

  try {
    const attributions = await attributionService.getAll({
      sector: sector,
      userId: user_id,
    });

    res.status(200).json(attributions);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Error getting attributions", error: error.message });
    } else {
      res.status(500).json({
        message: "Error getting attributions",
        error: "Unknown error",
      });
    }
  }
});

/**
 * @swagger
 * /attributions/:
 *   post:
 *     summary: Attribute a new document
 *     description: Attributes a new document by sector
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/NewAttributionRequest'
 *     responses:
 *       200:
 *         description: Successful attribution
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NewAttributionResponse'
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */

const upload = multer({ dest: "uploads/" });

router.post(
  "/",
  authMiddleware,
  upload.single("document"),
  async (req: AuthenticatedRequest<NewAttributionRequest>, res) => {
    const { title, sector, proposed_budget } = req.body;
    const document = req.file;

    const attributionService: AttributionServiceInterface =
      container.get<AttributionServiceInterface>(
        DI.AttributionServiceInterface,
      );

    try {
      // Ensure that a document is uploaded
      if (!document) {
        res.status(400).json({ message: "Document file is required" });
        return;
      }

      // Parse the multer file
      const parsedDocument = await FileParser.parseMulterFile(document);

      // Attribute the document
      const attributionRecord = await attributionService.attribute({
        sector: sector,
        userId: req.user!.id,
        title: title,
        document: parsedDocument,
        proposedBudget: proposed_budget,
      });

      res.status(200).json(attributionRecord);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res
          .status(500)
          .json({ message: "Error uploading document", error: error.message });
      } else {
        res.status(500).json({
          message: "Error uploading document",
          error: "Unknown error",
        });
      }
    }
  },
);

router.get("/export-evaluation-table",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    const { documentId } = req.query;

    if (!documentId) {
      res.status(400).json({ message: "Missing required query parameter: attributionId" });
      return;
    }

    try {
      const pb = PocketbaseService.getClient();
      await pb.admins.authWithPassword(
        process.env.POCKETBASE_ADMIN_EMAIL ?? "",
        process.env.POCKETBASE_ADMIN_PASSWORD ?? ""
      );

      const attributionRecord = await pb.collection("attributions").getOne(documentId as string);

      if (!attributionRecord || !attributionRecord.attribution) {
        res.status(404).json({ message: "Attribution not found" });
        return;
      }

      const attributionData = attributionRecord.attribution;

      res.status(200).json(attributionData);


    } catch (error) {
      console.error("Error exporting evaluation table:", error);
      res.status(500).json({ message: "Error exporting evaluation table", error: error instanceof Error ? error.message : error });
    }
  }
);

/**
 * @swagger
 * /attributions/fill-excel-file:
 *   post:
 *     summary: Fill multiple cells in a specified sheet of an Excel file
 *     description: This endpoint allows you to fill one or more cells in an Excel file by specifying the sheet name and an array of cell-value pairs. The file is then updated and returned.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sheetName
 *               - updates
 *             properties:
 *               sheetName:
 *                 type: string
 *                 description: Name of the sheet to be modified
 *               updates:
 *                 type: array
 *                 description: Array of cell updates to apply
 *                 items:
 *                   type: object
 *                   required:
 *                     - cell
 *                     - value
 *                   properties:
 *                     cell:
 *                       type: string
 *                       example: "A1"
 *                       description: Cell reference to update (e.g., 'A1')
 *                     value:
 *                       type: string
 *                       example: "Updated Value"
 *                       description: Value to insert into the cell
 *           example:
 *             sheetName: "Sheet1"
 *             updates:
 *               - cell: "A1"
 *                 value: "Updated Value 1"
 *               - cell: "B2"
 *                 value: "Updated Value 2"
 *     responses:
 *       200:
 *         description: Successfully updated the Excel file and returned it
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Missing or invalid required fields
 *       404:
 *         description: File or sheet not found
 *       500:
 *         description: Internal server error
 */
router.post("/fill-excel-file", async (req: Request, res: Response): Promise<void> => {
  const filePath = "./templates/HGDG_CHECKLIST.xlsx";
  await updateExcelFile(filePath, req.body, res);
});


router.post("/fill-excel-file-summary", async (req: Request, res: Response): Promise<void> => {
  const filePath = "./templates/HGDG_SUMMARY.xlsx";
  await updateExcelFile(filePath, req.body, res);
});

/**
 * @swagger
 * /attributions/{id}:
 *   delete:
 *     summary: Delete a document by ID
 *     description: Deletes a document from the documents collection using its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the document to delete
 *     responses:
 *       200:
 *         description: Document successfully deleted
 *       404:
 *         description: Document not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", authMiddleware, async (req: AuthenticatedRequest<GetAttibutionParams>, res: Response) => {
  const { id } = req.params;

  try {
    const pb = PocketbaseService.getClient();
    await pb.admins.authWithPassword(
      process.env.POCKETBASE_ADMIN_EMAIL ?? "",
      process.env.POCKETBASE_ADMIN_PASSWORD ?? ""
    );

    await pb.collection("attributions").delete(id);
    res.status(200).json({ message: `Document with ID ${id} successfully deleted` });

  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({ message: "Error deleting document", error: error instanceof Error ? error.message : error });
  }
});