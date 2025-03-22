import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

// Define schema information for the LLM
const schemaInfo = `
  Collections and their fields:
  1. individuals: {
    role: {type: String},
    name: {type: String},
    email: {type: String},
    password: {type: String},
    contact: {type: String},
    location: {type: String},
    reward: {type: Number, default: 0},
    OrdersServed: {type: Number, default: 0},
    OrdersReceived: {type: Number, default: 0},
    DonationsServed: {type: Number, default: 0},
    CommGroupId: {type: Number, default: 0},
    orders_placed: [{
      orderId: {type: mongoose.Schema.Types.ObjectId, ref: "Transaction"},
      status: {type: String, enum: ["pending", "completed"], default: "pending"},
      foodItems: [{foodName: String, quantity: Number}],
      orderedAt: {type: Date, default: Date.now},
    }],
    orders_received: [{
      orderId: {type: mongoose.Schema.Types.ObjectId, ref: "Transaction"},
      status: {type: String, enum: ["pending", "completed"], default: "pending"},
      foodItems: [{foodName: String, quantity: Number}],
      orderedAt: {type: Date, default: Date.now},
    }],
  }
  2. transactions: {
    serverUserId: {type: mongoose.Schema.Types.ObjectId, ref: "Individual"},
    receiverUserId: {type: mongoose.Schema.Types.ObjectId, ref: "Individual"},
    transactionId: {type: mongoose.Schema.Types.ObjectId},
    status: {type: String, enum: ["Pending", "Delivered"], default: "Pending"},
    serverConfirmed: {type: Boolean, default: false},
    receiverConfirmed: {type: Boolean, default: false},
    itemId: {type: mongoose.Schema.Types.ObjectId, ref: "ListedItem"}
  }
  3. ngos: {
    role: {type: String},
    name: {type: String},
    ngoId: {type: String, unique: true},
    password: {type: String},
    location: {type: String},
    rateKitchens: {type: Map, of: Number, default: {}},
    contact: {type: String},
    donationsReceived: {type: Number, default: 0},
  }
  4. kitchens: {
    role: {type: String},
    name: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    fssaiId: {type: String, unique: true},
    password: {type: String},
    location: {type: String},
    ordersServed: {type: Number, default: 0},
    donationsServed: {type: Number, default: 0},
    rewards: {type: Number, default: 0},
  }
  5. listeditems: {
    itemId: {type: mongoose.Schema.Types.ObjectId},
    itemName: {type: String},
    itemType: {type: String, enum: ["Perishable", "Non-Perishable"]},
    quantity: {type: Number},
    cost: {type: Number},
    status: {type: String, enum: ["Pending", "Delivered"], default: "Pending"},
    receiverId: {type: mongoose.Schema.Types.ObjectId, ref: "User", default: null},
    listedById: {type: mongoose.Schema.Types.ObjectId},
    listedByType: {type: String, enum: ["Individual", "Kitchen"]},
    listedBy: {type: mongoose.Schema.Types.ObjectId, refPath: "listedByType"},
  }
`;

/**
 * @desc Smart AI-powered query handling for MongoDB
 * @route POST /api/query
 * @access Public
 */
const getQueryAnswerFromDatabase = async (req, res) => {
  try {
    const { query, userId } = req.body;
    
    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required for personalized queries" });
    }

    console.log(`Processing query: "${query}" for user: ${userId}`);

    // Step 1: Plan the database query using LLM
    const queryPlan = await planDatabaseQuery(query, userId);
    console.log("Query planning complete:", queryPlan);

    // Step 2: Generate MongoDB query based on the plan
    const mongoQueryObject = await generateMongoDBQuery(queryPlan, userId);
    console.log("Generated MongoDB query:", mongoQueryObject);

    // Step 3: Execute the MongoDB query
    const results = await executeMongoDBQuery(mongoQueryObject);
    console.log("Query execution complete. Results obtained.");

    // Step 4: Generate natural language response
    const response = await generateResponse(query, results);
    console.log("Response generation complete.");

    return res.json({ 
      reply: response,
      metadata: {
        queryPlan: queryPlan,
        mongoQuery: mongoQueryObject,
        rawResults: results
      }
    });

  } catch (error) {
    console.error("Error processing query:", error);
    
    // Handle specific errors
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Invalid query parameters" });
    }
    
    if (error.name === "QueryGenerationError") {
      return res.status(422).json({ message: "Unable to generate database query from your question" });
    }
    
    if (error.name === "QueryExecutionError") {
      return res.status(500).json({ message: "Error executing database query" });
    }
    
    if (error.response && error.response.status === 429) {
      return res.status(429).json({ message: "Too many requests to AI service. Please try again later." });
    }
    
    return res.status(500).json({ 
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
/**
 * Step 1: Plan the database query
 * @param {string} query - User's natural language query
 * @param {string} userId - User's ID
 * @returns {object} Query planning information
 */
async function planDatabaseQuery(query, userId) {
  const planningPrompt = `
    You are a MongoDB query planner that converts natural language questions into structured query plans.
    
    User query: "${query}"
    User ID: "${userId}"
    
    Database schema information:
    ${schemaInfo}
    
    Your task:
    1. Understand what information the user is asking for
    2. Identify which collection(s) need to be queried
    3. Determine what filters and conditions to apply
    4. Decide if aggregation operations are needed
    
    Return a JSON object with the following structure:
    {
      "intent": "Brief description of what the user wants",
      "collections": ["Collection1", "Collection2"],
      "primaryCollection": "MainCollection",
      "filters": {
        "fieldName": "value or condition",
        "_id": "Must include the user ID for security"
      },
      "aggregation": boolean (whether aggregation is needed),
      "requiredFields": ["field1", "field2"]
    }
    
    IMPORTANT: Return only the raw JSON object. Do not wrap it in code blocks, quotes, or any other formatting.
  `;

  try {
    const response = await axios.post(
      GEMINI_API_ENDPOINT,
      { contents: [{ role: "user", parts: [{ text: planningPrompt }] }] },
      { params: { key: GEMINI_API_KEY } }
    );

    let planText = response.data.candidates[0].content.parts[0].text.trim();
    
    // Remove any Markdown code block formatting if present
    if (planText.startsWith("```json") || planText.startsWith("```")) {
      planText = planText.replace(/^```json\s*|^```\s*/g, "").replace(/\s*```$/g, "");
    }
    
    // Remove any leading/trailing quotes if present
    planText = planText.replace(/^['"`]|['"`]$/g, "");
    console.log(planText)
    try {
      return JSON.parse(planText);
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Raw text:", planText);
      throw new Error("Failed to parse query plan response");
    }
  } catch (error) {
    console.error("Error during query planning:", error);
    throw new Error("Failed to plan database query");
  }
}

async function generateMongoDBQuery(queryPlan, userId) {
  const queryGenerationPrompt = `
    Based on this query plan:
    ${JSON.stringify(queryPlan)}
    
    Generate a MongoDB query object with the following structure:
    {
      "collection": "CollectionName",
      "action": "findOne" | "find" | "aggregate",
      "filter": { /* MongoDB filter object */ },
      "projection": { /* MongoDB projection object */ },
      "aggregation": [ /* MongoDB aggregation pipeline, if needed */ ],
      "options": { /* Additional query options */ }
    }
    
    Ensure the query:
    1. Always includes the user ID (${userId}) in the filter for security
    2. Only requests necessary fields
    3. Uses appropriate MongoDB operators ($eq, $gt, $lt, etc.)
    
    IMPORTANT: For MongoDB ObjectIds, do NOT use ObjectId() function syntax. Instead, use plain strings:
    WRONG: { "_id": ObjectId("67deb786e228a44f1aa0edc4") }
    RIGHT: { "_id": "67deb786e228a44f1aa0edc4" }
    
    Return only the raw JSON object. Do not wrap it in code blocks, quotes, or any other formatting.
  `;

  try {
    const response = await axios.post(
      GEMINI_API_ENDPOINT,
      { contents: [{ role: "user", parts: [{ text: queryGenerationPrompt }] }] },
      { params: { key: GEMINI_API_KEY } }
    );

    let queryObjectText = response.data.candidates[0].content.parts[0].text.trim();
    
    // Remove any Markdown code block formatting if present
    if (queryObjectText.startsWith("```json") || queryObjectText.startsWith("```")) {
      queryObjectText = queryObjectText.replace(/^```json\s*|^```\s*/g, "").replace(/\s*```$/g, "");
    }
    
    // Replace any ObjectId() instances with string values
    queryObjectText = queryObjectText.replace(/ObjectId\(['"](.*?)['"]\)/g, '"$1"');
    
    // Remove any leading/trailing quotes if present
    queryObjectText = queryObjectText.replace(/^['"`]|['"`]$/g, "");
    
    try {
      let queryObject = JSON.parse(queryObjectText);
      
      // Validate the query object
      if (!queryObject.collection || !queryObject.action) {
        throw new Error("Generated query is missing required fields");
      }
      
      // Convert string ObjectId references to actual ObjectId objects
      queryObject = convertStringIdsToObjectIds(queryObject);
      
      return queryObject;
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Raw text:", queryObjectText);
      throw new Error("Failed to parse generated MongoDB query");
    }
  } catch (error) {
    console.error("Error generating MongoDB query:", error);
    const customError = new Error("Failed to generate MongoDB query");
    customError.name = "QueryGenerationError";
    throw customError;
  }
}

/**
 * Helper function to convert string IDs to MongoDB ObjectId
 * @param {object} queryObject - MongoDB query object
 * @returns {object} Query object with converted ObjectIds
 */
function convertStringIdsToObjectIds(queryObject) {
  // Deep clone the query object
  const newQuery = JSON.parse(JSON.stringify(queryObject));
  
  // Process the filter object
  if (newQuery.filter) {
    for (const [key, value] of Object.entries(newQuery.filter)) {
      if (typeof value === 'string' && 
          (key === '_id' || key.endsWith('Id') || key.endsWith('UserId'))) {
        try {
          newQuery.filter[key] = new mongoose.Types.ObjectId(value);
        } catch (e) {
          // If it's not a valid ObjectId, keep the original value
          console.warn(`Could not convert ${key} to ObjectId: ${value}`);
        }
      }
    }
  }
  
  // Process the aggregation pipeline if it exists
  if (newQuery.aggregation && Array.isArray(newQuery.aggregation)) {
    newQuery.aggregation = newQuery.aggregation.map(stage => {
      const newStage = { ...stage };
      // Process $match stages for ObjectIds
      if (newStage.$match) {
        for (const [key, value] of Object.entries(newStage.$match)) {
          if (typeof value === 'string' && 
              (key === '_id' || key.endsWith('Id') || key.endsWith('UserId'))) {
            try {
              newStage.$match[key] = new mongoose.Types.ObjectId(value);
            } catch (e) {
              // Keep original value if not a valid ObjectId
            }
          }
        }
      }
      return newStage;
    });
  }
  
  return newQuery;
}

/**
 * Step 3: Execute the MongoDB query
 * @param {object} queryObject - MongoDB query object
 * @returns {array|object} Query results
 */
async function executeMongoDBQuery(queryObject) {
  try {
    const collection = mongoose.connection.collection(queryObject.collection);
    let results;
    
    switch (queryObject.action) {
      case "findOne":
        results = await collection.findOne(
          queryObject.filter || {}, 
          { projection: queryObject.projection || {} }
        );
        break;
        
      case "find":
        results = await collection.find(
          queryObject.filter || {}, 
          { projection: queryObject.projection || {} }
        ).toArray();
        break;
        
      case "aggregate":
        if (!queryObject.aggregation || !Array.isArray(queryObject.aggregation)) {
          throw new Error("Aggregation pipeline is required for aggregate action");
        }
        results = await collection.aggregate(queryObject.aggregation).toArray();
        break;
        
      default:
        throw new Error(`Unsupported action: ${queryObject.action}`);
    }
    
    return results || null;
  } catch (error) {
    console.error("Error executing MongoDB query:", error);
    const customError = new Error("Failed to execute database query");
    customError.name = "QueryExecutionError";
    throw customError;
  }
}

/**
 * Step 4: Generate natural language response
 * @param {string} originalQuery - User's original query
 * @param {array|object} results - MongoDB query results
 * @returns {string} Natural language response
 */
async function generateResponse(originalQuery, results) {
  const responsePrompt = `
    You are an AI assistant that converts database results into natural, conversational responses.
    
    Original user query: "${originalQuery}"
    
    Database results: ${JSON.stringify(results, null, 2)}
    
    Please generate a natural language response that:
    1. Directly answers the user's question
    2. Summarizes the key information from the results
    3. Is conversational and friendly in tone
    4. Includes specific details from the results where relevant
    5. Handles cases where results might be empty or null
    
    Your response should NOT:
    - Include technical database terminology
    - Mention the query itself or how it was processed
    - Include JSON formatting or raw data dumps
    
    Response:
  `;

  try {
    const response = await axios.post(
      GEMINI_API_ENDPOINT,
      { contents: [{ role: "user", parts: [{ text: responsePrompt }] }] },
      { params: { key: GEMINI_API_KEY } }
    );

    return response.data.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    console.error("Error generating response:", error);
    return "I found the information you requested, but I'm having trouble putting it into words. Here's what I found: " + 
           JSON.stringify(results, null, 2);
  }
}

export { getQueryAnswerFromDatabase };