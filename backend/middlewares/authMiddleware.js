import JWT from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers["authorization"];

    if (!authorizationHeader) {
      return res.status(401).send({
        message: "Authorization header missing",
        success: false,
      });
    }

    const token = authorizationHeader.split(" ")[1];

    if (!token) {
      return res.status(401).send({
        message: "Token missing",
        success: false,
      });
    }

    JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(401).send({
          message: "Auth Failed",
          success: false,
        });
      } else {
        // console.log("Decoded User ID:", decode.id);
        req.body.userId = decode.id;  // Set user ID on request body
        next();  // Proceed to the next middleware or route handler
      }
    });
  } catch (error) {
    console.log("Error in authMiddleware:", error);
    res.status(401).send({
      message: "Auth Failed",
      success: false,
    });
  }
};

export { authMiddleware };
