const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const Problem = require("../models/Problem");
const User = require("../models/User");

const mongoDB = process.env.MONGODB_URI;

const testProblems = [
  // Arrays
  { title: "Two Sum", description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.", difficulty: "easy", status: "unsolved", tags: ["array", "hash-table"], category: "array" },
  { title: "Best Time to Buy and Sell Stock", description: "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit.", difficulty: "easy", status: "unsolved", tags: ["array", "dynamic-programming"], category: "array" },
  { title: "Product of Array Except Self", description: "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].", difficulty: "medium", status: "unsolved", tags: ["array"], category: "array" },
  { title: "Maximum Subarray", description: "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum.", difficulty: "medium", status: "unsolved", tags: ["array", "dynamic-programming"], category: "array" },
  { title: "Trapping Rain Water", description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.", difficulty: "hard", status: "unsolved", tags: ["array", "two-pointers"], category: "array" },
  { title: "Median of Two Sorted Arrays", description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.", difficulty: "hard", status: "unsolved", tags: ["array", "binary-search"], category: "array" },

  // Strings
  { title: "Valid Palindrome", description: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.", difficulty: "easy", status: "unsolved", tags: ["string", "two-pointers"], category: "string" },
  { title: "Valid Anagram", description: "Given two strings s and t, return true if t is an anagram of s, and false otherwise.", difficulty: "easy", status: "unsolved", tags: ["string", "hash-table"], category: "string" },
  { title: "Longest Substring Without Repeating Characters", description: "Given a string s, find the length of the longest substring without repeating characters.", difficulty: "medium", status: "unsolved", tags: ["string", "sliding-window"], category: "string" },
  { title: "Longest Palindromic Substring", description: "Given a string s, return the longest palindromic substring in s.", difficulty: "medium", status: "unsolved", tags: ["string", "dynamic-programming"], category: "string" },
  { title: "Regular Expression Matching", description: "Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*'.", difficulty: "hard", status: "unsolved", tags: ["string", "dynamic-programming"], category: "string" },
  { title: "Minimum Window Substring", description: "Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t is included.", difficulty: "hard", status: "unsolved", tags: ["string", "sliding-window"], category: "string" },

  // Linked Lists
  { title: "Reverse Linked List", description: "Given the head of a singly linked list, reverse the list, and return the reversed list.", difficulty: "easy", status: "unsolved", tags: ["linkedlist", "recursion"], category: "linkedlist" },
  { title: "Merge Two Sorted Lists", description: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a one sorted list.", difficulty: "easy", status: "unsolved", tags: ["linkedlist"], category: "linkedlist" },
  { title: "Linked List Cycle", description: "Given head, the head of a linked list, determine if the linked list has a cycle in it.", difficulty: "easy", status: "unsolved", tags: ["linkedlist", "two-pointers"], category: "linkedlist" },
  { title: "Remove Nth Node From End of List", description: "Given the head of a linked list, remove the nth node from the end of the list and return its head.", difficulty: "medium", status: "unsolved", tags: ["linkedlist", "two-pointers"], category: "linkedlist" },
  { title: "Merge k Sorted Lists", description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.", difficulty: "hard", status: "unsolved", tags: ["linkedlist", "heap"], category: "linkedlist" },
  { title: "Reverse Nodes in k-Group", description: "Given the head of a linked list, reverse the nodes of the list k at a time, and return the modified list.", difficulty: "hard", status: "unsolved", tags: ["linkedlist"], category: "linkedlist" },

  // Stacks
  { title: "Valid Parentheses", description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.", difficulty: "easy", status: "unsolved", tags: ["stack", "string"], category: "stack" },
  { title: "Min Stack", description: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.", difficulty: "medium", status: "unsolved", tags: ["stack", "design"], category: "stack" },
  { title: "Evaluate Reverse Polish Notation", description: "Evaluate the value of an arithmetic expression in Reverse Polish Notation. Valid operators are +, -, *, and /.", difficulty: "medium", status: "unsolved", tags: ["stack"], category: "stack" },
  { title: "Daily Temperatures", description: "Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature.", difficulty: "medium", status: "unsolved", tags: ["stack"], category: "stack" },
  { title: "Largest Rectangle in Histogram", description: "Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.", difficulty: "hard", status: "unsolved", tags: ["stack"], category: "stack" },
  { title: "Maximal Rectangle", description: "Given a rows x cols binary matrix filled with 0's and 1's, find the largest rectangle containing only 1's and return its area.", difficulty: "hard", status: "unsolved", tags: ["stack", "matrix"], category: "stack" },

  // Queues
  { title: "Implement Queue using Stacks", description: "Implement a first in first out (FIFO) queue using only two stacks.", difficulty: "easy", status: "unsolved", tags: ["queue", "stack"], category: "queue" },
  { title: "Number of Students Unable to Eat Lunch", description: "The school cafeteria offers circular and square sandwiches at lunch break. Return the number of students that are unable to eat.", difficulty: "easy", status: "unsolved", tags: ["queue", "simulation"], category: "queue" },
  { title: "Sliding Window Maximum", description: "You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right.", difficulty: "hard", status: "unsolved", tags: ["queue", "sliding-window"], category: "queue" },
  { title: "Kth Largest Element in an Array", description: "Given an integer array nums and an integer k, return the kth largest element in the array.", difficulty: "medium", status: "unsolved", tags: ["queue", "heap"], category: "queue" },
  { title: "Find the Winner of the Circular Game", description: "There are n friends that are playing a game. The friends are sitting in a circle and are numbered from 1 to n.", difficulty: "medium", status: "unsolved", tags: ["queue", "simulation"], category: "queue" },
  { title: "Design Circular Queue", description: "Design your implementation of the circular queue. The array limits are defined.", difficulty: "medium", status: "unsolved", tags: ["queue", "design"], category: "queue" },

  // Trees
  { title: "Maximum Depth of Binary Tree", description: "Given the root of a binary tree, return its maximum depth.", difficulty: "easy", status: "unsolved", tags: ["tree", "dfs"], category: "tree" },
  { title: "Invert Binary Tree", description: "Given the root of a binary tree, invert the tree, and return its root.", difficulty: "easy", status: "unsolved", tags: ["tree", "bfs"], category: "tree" },
  { title: "Lowest Common Ancestor of a BST", description: "Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.", difficulty: "medium", status: "unsolved", tags: ["tree", "dfs"], category: "tree" },
  { title: "Binary Tree Level Order Traversal", description: "Given the root of a binary tree, return the level order traversal of its nodes' values.", difficulty: "medium", status: "unsolved", tags: ["tree", "bfs"], category: "tree" },
  { title: "Serialize and Deserialize Binary Tree", description: "Design an algorithm to serialize and deserialize a binary tree.", difficulty: "hard", status: "unsolved", tags: ["tree", "design"], category: "tree" },
  { title: "Binary Tree Maximum Path Sum", description: "Given the root of a binary tree, return the maximum path sum of any non-empty path.", difficulty: "hard", status: "unsolved", tags: ["tree", "dfs"], category: "tree" }
];

async function seedDB() {
  try {
    await mongoose.connect(mongoDB);
    console.log("✅ Connected to MongoDB");

    // Get first user (or create one for demo)
    let user = await User.findOne();
    if (!user) {
      console.log("⚠️  No users found, creating a demo user...");
      user = await User.create({
        username: "demo_user",
        email: "demo@example.com",
        password: "hashed_password_here",
      });
      console.log(`✅ Created demo user: ${user.email}`);
    }

    // Clear existing problems (optional)
    await Problem.deleteMany({});
    console.log("🗑️  Cleared existing problems");

    // Add createdBy to each problem
    const problemsWithUser = testProblems.map((problem) => ({
      ...problem,
      createdBy: user._id,
    }));

    // Insert problems
    const inserted = await Problem.insertMany(problemsWithUser);
    console.log(`✅ Seeded ${inserted.length} problems`);

    // Show stats
    const easyCount = await Problem.countDocuments({ difficulty: "easy" });
    const mediumCount = await Problem.countDocuments({ difficulty: "medium" });
    const hardCount = await Problem.countDocuments({ difficulty: "hard" });
    const solvedCount = await Problem.countDocuments({ status: "solved" });
    const unsolvedCount = await Problem.countDocuments({ status: "unsolved" });

    console.log("\n📊 Database Stats:");
    console.log(
      `   Easy: ${easyCount}, Medium: ${mediumCount}, Hard: ${hardCount}`,
    );
    console.log(`   Solved: ${solvedCount}, Unsolved: ${unsolvedCount}`);

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error seeding database:", error.message);
    process.exit(1);
  }
}

seedDB();
