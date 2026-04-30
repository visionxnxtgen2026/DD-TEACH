import Subject from "../models/Subject.js";
import Unit from "../models/Unit.js";
import Topic from "../models/Topic.js";
import Content from "../models/Content.js";

/**
 * ==========================================
 * 📊 GET DASHBOARD STATISTICS
 * ==========================================
 * @desc    Fetch aggregated counts for subjects (by type), units, topics, and content items
 * @route   GET /api/dashboard/stats
 * @access  Private/Admin
 */
export const getDashboardStats = async (req, res) => {
  try {
    // 🔥 Optimization: Running all counts in parallel for maximum performance
    // Values are updated to match our lowercase 'type' logic
    const [
      schoolSubjects,
      collegeSubjects,
      totalUnits,
      totalTopics,
      totalContent
    ] = await Promise.all([
      Subject.countDocuments({ type: "school" }),   // ✅ Fixed field & value
      Subject.countDocuments({ type: "college" }),  // ✅ Fixed field & value
      Unit.countDocuments(),
      Topic.countDocuments(),
      Content.countDocuments(),
    ]);

    // Send standardized JSON response
    return res.status(200).json({
      success: true,
      data: {
        schoolSubjects,
        collegeSubjects,
        totalUnits,
        totalTopics,
        totalContent,
        // Optional: Adding a total subjects count
        totalSubjects: schoolSubjects + collegeSubjects
      },
    });
  } catch (err) {
    console.error("❌ DASHBOARD_STATS_ERROR:", err.message);

    // Using the standardized error format
    return res.status(500).json({
      success: false,
      message: "An error occurred while generating dashboard statistics.",
      error: err.message
    });
  }
};