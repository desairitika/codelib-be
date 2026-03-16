const { getCount, getAllProblems, createProblem, getProblemById, updateProblemById, deleteProblemById, createProblemsInBulk } = require("../data/mongoose/problem");
const { getAllConstants } = require("../data/mongoose/constant");
const { dbErrorHandler } = require("../utils/errorHandler");
const { getResponseStructure } = require("../utils/helper");
const CommonService = require("../services/commonService");
const ExcelJS = require("exceljs");

class ProblemService {
  static async getAllProblems(payload, page = 1, limit = 100) {
    try {
      const problems = await getAllProblems(payload, page, limit);
      const totalCount = await getCount(payload); // Get the total count for pagination
      return getResponseStructure(200, "message", "Success", { problems, totalCount });
    } catch (err) {
      return dbErrorHandler(err);
    }
  }

  static async getDashboardStats(payload) {
    try {
      const [total, solved, unsolved, easy, medium, hard] = await Promise.all([
        getCount(payload),
        getCount({ ...payload, status: "solved" }),
        getCount({ ...payload, status: "unsolved" }),
        getCount({ ...payload, difficulty: "easy" }),
        getCount({ ...payload, difficulty: "medium" }),
        getCount({ ...payload, difficulty: "hard" }),
      ]);

      const response = {
        total,
        solved,
        unsolved,
        easy,
        medium,
        hard,
        categoryCounts: {},
      };

      const constants = await getAllConstants(); // Drop payload unless you're filtering
      await Promise.all(
        constants.map(async (data) => {
          const plainData = data.toObject();
          const count = await getCount({ category: plainData.value });
          response.categoryCounts[plainData.value] = count;
        })
      );

      return getResponseStructure(200, "message", "Success", response, "stats");
    } catch (err) {
      return dbErrorHandler(err);
    }
  }

  static async getFilteredProblems(filters, page, limit) {
    try {
      const problems = await getAllProblems(filters, page, limit);
      const totalCount = await getCount(filters); // Get the total count for pagination
      return getResponseStructure(200, "message", "Success", { problems, totalCount });
    } catch (err) {
      return dbErrorHandler(err);
    }
  }

  static async createProblem(body) {
    try {
      const problem = await createProblem(body);
      return getResponseStructure(201, "message", "Problem created successfully", problem);
    } catch (error) {
      return dbErrorHandler(error);
    }
  }

  static async getProblemById(problemId) {
    try {
      const problem = await getProblemById(problemId);
      return getResponseStructure(200, "message", "Success", problem);
    } catch (error) {
      return dbErrorHandler(error);
    }
  }

  static async updateProblem(problemId, body) {
    try {
      if (!Object.keys(body).length) {
        return getResponseStructure(204, "message", "");
      }
      const updatedProblem = await updateProblemById(problemId, body);
      return getResponseStructure(200, "message", "Problem updated successfully", updatedProblem);
    } catch (error) {
      return dbErrorHandler(error);
    }
  }

  static async deleteProblem(problemId) {
    try {
      await deleteProblemById(problemId);
      return getResponseStructure(204, "message", "Problem Deleted Successful.");
    } catch (err) {
      return dbErrorHandler(err);
    }
  }

  static async downloadTemplate() {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Template");

      const headers = ["Title", "Description", "Difficulty", "Category", "Tags"];
      const difficulties = ["Easy", "Medium", "Hard"];
      const constants = await CommonService.getConstants();
      const categories = constants.data.map((constant) => constant.label);

      // Add headers
      const headerRow = worksheet.addRow(headers);

      // Define column widths
      worksheet.columns = [
        { width: 20 }, // Width for 'Title'
        { width: 30 }, // Width for 'Description'
        { width: 15 }, // Width for 'Difficulty'
        { width: 20 }, // Width for 'Category'
        { width: 20 }, // Width for 'Tags'
      ];

      // Color the header
      headerRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "befca9" },
        };
        cell.font = {
          bold: true,
          color: { argb: "000" },
        };
        cell.alignment = { horizontal: "center" };
      });

      // Function to create mandatory validation
      // const createMandatoryValidation = () => ({
      //   type: "custom",
      //   formulae: ['ISNUMBER(SEARCH(" ", A1))'], // Checks if the cell is not empty
      //   showErrorMessage: true,
      //   errorTitle: "Required Field",
      //   error: "This field cannot be left blank",
      // });

      // Create data validation rules
      const createDataValidation = (list) => ({
        type: "list",
        formulae: [`"${list.join(",")}"`],
        showErrorMessage: true,
        errorTitle: "Invalid input",
        error: "Please select a value from the list",
      });

      // Apply data validation to rows 2 to 100
      for (let i = 2; i <= 100; i++) {
        // worksheet.getCell(`A${i}`).dataValidation = createMandatoryValidation();
        // worksheet.getCell(`B${i}`).dataValidation = createMandatoryValidation();
        worksheet.getCell(`C${i}`).dataValidation = createDataValidation(difficulties);
        worksheet.getCell(`D${i}`).dataValidation = createDataValidation(categories);
      }

      // Write the workbook to a buffer and send it
      const buffer = await workbook.xlsx.writeBuffer();
      return buffer;
    } catch (err) {
      throw err;
    }
  }

  static validateRowData(row) {
    const title = row.getCell(1).value?.toString().trim();
    const description = row.getCell(2).value?.toString().trim();
    const difficulty = row.getCell(3).value?.toString().trim().toLowerCase();
    const category = row.getCell(4).value?.toString().trim().toLowerCase().replace(" ", "");
    const tags = row.getCell(5).value?.toString().trim();

    return title && difficulty && category ? { title, description, difficulty, category, tags } : null;
  }

  static async processWorksheet(worksheet, userId) {
    const dataToInsert = [];

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber > 1) {
        // Skip header row
        const validatedData = this.validateRowData(row);
        if (validatedData) {
          dataToInsert.push({ ...validatedData, createdBy: userId });
        }
      }
    });

    return dataToInsert;
  }

  static async handleFileUpload(fileBuffer, userId) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(fileBuffer);
    const worksheet = workbook.getWorksheet("Template");

    if (!worksheet) {
      throw new Error("Template worksheet not found.");
    }

    const dataToInsert = await this.processWorksheet(worksheet, userId);

    if (dataToInsert.length === 0) {
      throw new Error("No valid data to insert.");
    }

    const result = await createProblemsInBulk(dataToInsert);
    const logger = require('../utils/logger');
    logger.info(`${result.length} rows added successfully`);
    return `${result.length} Problems added successfully`;
  }
}

module.exports = ProblemService;
