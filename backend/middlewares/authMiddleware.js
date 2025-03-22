import JWT from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers["authorization"];

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization header missing or invalid",
        success: false,
      });
    }

    const token = authorizationHeader.split(" ")[1];

    JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: "Invalid or expired token",
          success: false,
        });
      }

      // ✅ Attach user details to req.user
      req.user = {
        id: decoded.id,
        role: decoded.role, // Assuming role is included in the JWT payload
      };

      next();
    });
  } catch (error) {
    console.error("Error in authMiddleware:", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export { authMiddleware };
