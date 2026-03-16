const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const Problem = require("../models/Problem");
const User = require("../models/User");

const mongoDB = process.env.MONGODB_URI;

const testProblems = [
  //   {
  //     title: "Two Sum",
  //     description: "Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target.",
  //     difficulty: "easy",
  //     status: "unsolved",
  //     tags: ["array", "hash-table"],
  //     category: "algorithms",
  //   }
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
