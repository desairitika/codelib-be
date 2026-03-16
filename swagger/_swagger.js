const fs = require("fs");
const path = require("path");

function readJSONFilesFromFolder(folderPath) {
  return fs
    .readdirSync(folderPath)
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      const filePath = path.join(folderPath, file);
      return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    });
}

function mergeJSONObjects(jsonArray) {
  return jsonArray.reduce((mergedJSON, currentJSON) => {
    return { ...mergedJSON, ...currentJSON };
  }, {});
}

const folderPath = "./swagger";
const jsonObjectsArray = readJSONFilesFromFolder(folderPath);
const mergedJSON = mergeJSONObjects(jsonObjectsArray);

const rootConfig = {
  openapi: "3.1.0",
  info: {
    title: "CodeLib",
    version: "0.1.0",
    description: "API Documentation",
  },
  servers: [
    {
      url: "http://localhost:3000/api/v1",
      description: "Development server",
    },
  ],
  tags: [
    {
      name: "Auth",
      description: "Authentication related API",
    },
    {
      name: "Users",
      description: "Users managing API",
    },
    {
      name: "Problems",
      description: "Problem related api's",
    },
    {
      name: "Solutions",
      description: "Solution related api's",
    },
    {
      name: "Comments",
      description: "Comment related api's",
    },
    {
      name: "Constants",
      description: "Application constants (public GET)"
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  paths: {
    ...mergedJSON,
  },
};

module.exports = rootConfig;
