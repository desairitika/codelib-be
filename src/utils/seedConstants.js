// seedConstants.js
const Constant = require("../models/Constant");

const defaultConstants = [
  { value: "array", label: "Array", type: "category", icon: "MdDataArray" },
  { value: "string", label: "String", type: "category", icon: "AiOutlineFieldString" },
  { value: "linkedlist", label: "Linked List", type: "category", icon: "LuListEnd" },
  { value: "stack", label: "Stack", type: "category", icon: "RiStackLine" },
  { value: "queue", label: "Queue", type: "category", icon: "BsCollection" },
  { value: "tree", label: "Tree", type: "category", icon: "TbBinaryTree" },
  { value: "graph", label: "Graph", type: "category", icon: "GrGraphQl" },
  { value: "dynamicprogramming", label: "Dynamic Programming", type: "category", icon: "MdDynamicFeed" },
  { value: "hashtable", label: "Hash Table", type: "category", icon: "LiaSlackHash" },
];

const logger = require('./logger');

const seedConstants = async () => {
  logger.info('Seeding constants started');
  try {
    for (const constant of defaultConstants) {
      const exists = await Constant.findOne({ value: constant.value });
      if (!exists) {
        await Constant.create(constant);
        logger.debug(`Inserted constant: ${constant.label}`);
      } else {
        logger.debug(`Constant exists: ${constant.label}`);
      }
    }
    logger.info('Seeding constants done');
  } catch (error) {
    logger.error('Error seeding constants', { error: error.message });
  }
};

module.exports = seedConstants;
