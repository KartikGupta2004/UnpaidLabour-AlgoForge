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

// Website features and information
const websiteInfo = `
  Website: Food Donation and Redistribution Platform
  
  Key Features:
  1. User Roles: 
     - Individuals: Can donate food, receive donations, and place/receive orders
     - Kitchens: Professional food services that can distribute food to those in need
     - NGOs: Organizations that receive and distribute donations
  
  2. Food Donation System:
     - Users can list food items they want to donate
     - Items can be perishable or non-perishable
     - Users earn rewards for donations
  
  3. Order System:
     - Users can place orders for food items
     - Orders have status tracking (pending, completed)
     - Transactions track the exchange between server and receiver
  
  4. Community Features:
     - Community groups for local food sharing
     - Rating system for kitchens
  
  5. Rewards System:
     - Users earn rewards for donations
     - Rewards can be used for various benefits on the platform
  
  Common User Questions:
  - How to donate food
  - How to track donations
  - How to check order status
  - How to join community groups
  - How to earn and use rewards
`;

/**
 * @desc Smart AI-powered assistant for the food donation platform
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
      return res.status(400).json({ message: "User ID is required for personalized assistance" });
    }

    console.log(`Processing query: "${query}" for user: ${userId}`);

    // Step 1: Determine if the query needs database access or just general information
    const queryAnalysis = await analyzeQuery(query, userId);
    console.log("Query analysis complete:", queryAnalysis);

    let response;
    let metadata = { queryType: queryAnalysis.queryType };

    // Step 2: Handle the query based on its type
    if (queryAnalysis.queryType === "database") {
      // Database query flow
      const queryPlan = await planDatabaseQuery(query, userId, queryAnalysis);
      console.log("Query planning complete:", queryPlan);
      
      const mongoQueryObject = await generateMongoDBQuery(queryPlan, userId);
      console.log("Generated MongoDB query:", mongoQueryObject);
      
      const results = await executeMongoDBQuery(mongoQueryObject);
      console.log("Query execution complete. Results obtained.");
      
      response = await generateResponse(query, results, queryAnalysis, queryPlan);
      
      metadata = {
        ...metadata,
        queryPlan: queryPlan,
        mongoQuery: mongoQueryObject,
        rawResults: results
      };
    } else {
      // General information or guidance flow
      response = await generateInformationalResponse(query, queryAnalysis);
    }

    console.log("Response generation complete.");
    return res.json({ 
      reply: response,
      metadata: metadata
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
 * Step 0: Analyze the query to determine if it needs database access
 * @param {string} query - User's natural language query
 * @param {string} userId - User's ID
 * @returns {object} Query analysis information
 */
async function analyzeQuery(query, userId) {
  const analysisPrompt = `
    You are an intelligent assistant for a food donation and redistribution platform.
    
    User query: "${query}"
    User ID: "${userId}"
    
    Website information:
    ${websiteInfo}
    
    Database schema information:
    ${schemaInfo}
    
    Your task:
    1. Analyze if this query requires database access or can be answered with general information
    2. Identify the category of the query (account, orders, donations, general info, features, etc.)
    3. Determine if this is a personal data query (requires database) or general question (can be answered without database)
    
    Return a JSON object with the following structure:
    {
      "queryType": "database" or "informational",
      "category": "account", "orders", "donations", "features", "help", etc.,
      "requiresPersonalData": boolean,
      "intent": "Brief description of what the user wants",
      "contextNeeded": ["specific pieces of context that would be helpful"]
    }
    
    IMPORTANT: Return only the raw JSON object. Do not wrap it in code blocks, quotes, or any other formatting.
  `;

  try {
    const response = await axios.post(
      GEMINI_API_ENDPOINT,
      { contents: [{ role: "user", parts: [{ text: analysisPrompt }] }] },
      { params: { key: GEMINI_API_KEY } }
    );

    let analysisText = response.data.candidates[0].content.parts[0].text.trim();
    
    // Remove any Markdown code block formatting if present
    if (analysisText.startsWith("```json") || analysisText.startsWith("```")) {
      analysisText = analysisText.replace(/^```json\s*|^```\s*/g, "").replace(/\s*```$/g, "");
    }
    
    // Remove any leading/trailing quotes if present
    analysisText = analysisText.replace(/^['"`]|['"`]$/g, "");
    
    try {
      return JSON.parse(analysisText);
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Raw text:", analysisText);
      // Default to database query if we can't parse the analysis
      return {
        queryType: "database",
        category: "unknown",
        requiresPersonalData: true,
        intent: "Process user query",
        contextNeeded: []
      };
    }
  } catch (error) {
    console.error("Error during query analysis:", error);
    throw new Error("Failed to analyze query");
  }
}

/**
 * Step 1: Plan the database query
 * @param {string} query - User's natural language query
 * @param {string} userId - User's ID
 * @param {object} queryAnalysis - Analysis of the query
 * @returns {object} Query planning information
 */
async function planDatabaseQuery(query, userId, queryAnalysis) {
  const planningPrompt = `
    You are a MongoDB query planner that converts natural language questions into structured query plans.
    
    User query: "${query}"
    User ID: "${userId}"
    Query analysis: ${JSON.stringify(queryAnalysis)}
    
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
        "userId": "Must include the user ID for security"
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

/**
 * Step 2: Generate MongoDB query based on plan
 * @param {object} queryPlan - Query planning information
 * @param {string} userId - User's ID
 * @returns {object} MongoDB query object
 */
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
 * Generate a response for database queries
 * @param {string} originalQuery - User's original query
 * @param {array|object} results - MongoDB query results
 * @param {object} queryAnalysis - Analysis of the query
 * @param {object} queryPlan - Query planning information
 * @returns {string} Natural language response
 */
async function generateResponse(originalQuery, results, queryAnalysis, queryPlan) {
  const responsePrompt = `
    You are an intelligent, conversational assistant for a food donation and redistribution platform.
    
    Original user query: "${originalQuery}"
    Query analysis: ${JSON.stringify(queryAnalysis)}
    Query plan: ${JSON.stringify(queryPlan)}
    
    Database results: ${JSON.stringify(results, null, 2)}
    
    Website information:
    ${websiteInfo}
    
    Please generate a detailed, helpful response that:
    1. Directly answers the user's question using the database results
    2. Provides context and explanation where helpful
    3. Is conversational, friendly, and engaging in tone
    4. Includes specific details from the results where relevant
    5. Offers relevant follow-up suggestions or tips based on their query
    6. Handles cases where results might be empty or null gracefully
    
    Your response should be specific.
    Consider how you would explain this information to a friend in a helpful way.
    Bold the specific answer keywords
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

/**
 * Generate a response for informational queries (no database required)
 * @param {string} originalQuery - User's original query
 * @param {object} queryAnalysis - Analysis of the query
 * @returns {string} Natural language response
 */
async function generateInformationalResponse(originalQuery, queryAnalysis) {
  const responsePrompt = `
    You are an intelligent, conversational assistant for a food donation and redistribution platform.
    
    Original user query: "${originalQuery}"
    Query analysis: ${JSON.stringify(queryAnalysis)}
    
    Website information:
    ${websiteInfo}
    
    Please generate a helpful response that:
    1. Directly addresses the user's question using the website information
    2. Is conversational, friendly, and engaging in tone
    3. Offers relevant follow-up suggestions or tips based on their query
    4. Includes examples where helpful
    
    Your response should be specific, like a knowledgeable customer service agent.
    Consider how you would explain this information to a friend in a helpful way.
    Bold the specific answer keywords

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
    console.error("Error generating informational response:", error);
    return "I understand you're asking about our platform's features. Let me help you with that. Our food donation platform allows individuals and organizations to connect for food sharing and distribution. What specific aspect would you like to know more about?";
  }
}

export { getQueryAnswerFromDatabase };