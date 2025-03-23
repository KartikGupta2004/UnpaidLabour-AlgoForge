import Individual from "../models/indivisual_users.js";

// Update Profile Controller
const updateProfileController = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from auth middleware
    const { name, email, contact, location } = req.body;

    // Find and Update User
    const user = await Individual.findByIdAndUpdate(
      userId,
      { name, email, contact, location },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ message: "Profile updated successfully.", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

export { updateProfileController};
