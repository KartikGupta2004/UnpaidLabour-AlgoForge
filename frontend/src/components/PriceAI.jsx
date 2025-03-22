import { useEffect } from "react";
import axios from "axios";
import Papa from "papaparse";
import Fuse from "fuse.js";

function PriceAI({ query, onPriceFetched }) {
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  
  useEffect(() => {
    if (!query) return;

    const fetchFoodData = async () => {
      try {
        const response = await fetch("/data/IndianFoodDatasetCSV_with_prices.csv");
        const csv = await response.text();

        Papa.parse(csv, {
          header: true,
          complete: async (result) => {
            const foodData = result.data;
            const price = await processQuery(query, foodData);
            onPriceFetched(price);
          },
        });
      } catch (error) {
        console.error("Error fetching CSV:", error);
        onPriceFetched("Error: Could not fetch data.");
      }
    };

    fetchFoodData();
  }, [query]);

  const processQuery = async (query, foodData) => {
    const fuse = new Fuse(foodData, {
      keys: ["TranslatedRecipeName"],
      threshold: 0.3,
    });

    const results = fuse.search(query).slice(0, 10);

    if (results.length === 0) {
      return "No matches found.";
    }

    const matchList = results
      .map((result, index) => {
        const name = result.item.TranslatedRecipeName;
        const price = result.item.Average_Resell_Price;
        return `${index + 1}. ${name} (Current Price: ₹${price})`;
      })
      .join("\n");

    const prompt = `User query: "${query}".\nHere are 5 matching food items from our database:\n${matchList}\n\nPlease find the best match among these items and return only the recommended resale price (in integers) for that item. If you don't find anything accurate, return the cheapest product. Only respond with ₹ amount.`;

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
        { contents: [{ parts: [{ text: prompt }] }] }
      );

      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("Error querying Gemini:", error);
      return "Error: Could not get price.";
    }
  };

  return null; // This component doesn't render anything, just acts like a function.
}

export default PriceAI;
