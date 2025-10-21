const express = require("express");
const router = express.Router();
const StringModel = require("./models");
const crypto = require("crypto");

function analyzeString(value) {
  const length = value.length;
  const cleaned = value.toLowerCase().replace(/\s+/g, '');
  const is_palindrome = cleaned === cleaned.split('').reverse().join('');
  const unique_characters = new Set(value).size;
  const word_count = value.trim().split(/\s+/).length;
  const sha256_hash = crypto.createHash('sha256').update(value).digest('hex');
  const character_frequency_map = {};
  for (const char of value) {
    character_frequency_map[char] = (character_frequency_map[char] || 0) + 1;
  }
  return {
    length,
    is_palindrome,
    unique_characters,
    word_count,
    sha256_hash,
    character_frequency_map
  };
}

router.post("/strings", async (req, res) => {
  try {
    const { value } = req.body;
    if (!value) return res.status(400).json({ message: "Missing 'value' field" });
    if (typeof value !== "string") return res.status(422).json({ message: "'value' must be a string" });
    const existing = await StringModel.findOne({ value });
    if (existing) return res.status(409).json({ message: "String already exists in the system" });
    const properties = analyzeString(value);
    const newString = new StringModel({ value, properties });
    await newString.save();
    return res.status(201).json({
      id: properties.sha256_hash,
      value,
      properties,
      created_at: newString.created_at,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error, try again later" });
  }
});

router.get("/strings/:string_value", async (req, res) => {
  try {
    const { string_value } = req.params;
    const stringData = await StringModel.findOne({ value: string_value });
    if (!stringData) return res.status(404).json({ message: "String does not exist in the system" });
    res.status(200).json(stringData);
  } catch {
    res.status(500).json({ message: "Server error, try again later" });
  }
});

router.get("/strings", async (req, res) => {
  try {
    const { is_palindrome, min_length, max_length, word_count, contains_character } = req.query;
    const filters = {};
    if (is_palindrome !== undefined) filters["properties.is_palindrome"] = is_palindrome === "true";
    if (min_length) filters["properties.length"] = { ...filters["properties.length"], $gte: parseInt(min_length) };
    if (max_length) filters["properties.length"] = { ...filters["properties.length"], $lte: parseInt(max_length) };
    if (word_count) filters["properties.word_count"] = parseInt(word_count);
    if (contains_character) filters.value = { $regex: contains_character, $options: "i" };
    const data = await StringModel.find(filters);
    res.status(200).json({
      data,
      count: data.length,
      filters_applied: {
        is_palindrome: is_palindrome ? is_palindrome === "true" : undefined,
        min_length: min_length ? parseInt(min_length) : undefined,
        max_length: max_length ? parseInt(max_length) : undefined,
        word_count: word_count ? parseInt(word_count) : undefined,
        contains_character: contains_character || undefined
      }
    });
  } catch {
    res.status(400).json({ message: "Invalid query parameter values or types" });
  }
});

router.get("/strings/filter-by-natural-language", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: "Missing query" });
    let parsed = {};
    const lower = query.toLowerCase();
    if (lower.includes("palindromic")) parsed.is_palindrome = true;
    if (lower.includes("single word")) parsed.word_count = 1;
    const longerMatch = lower.match(/longer than (\d+)/);
    if (longerMatch) parsed.min_length = parseInt(longerMatch[1]) + 1;
    const containsMatch = lower.match(/containing the letter ([a-z])/);
    if (containsMatch) parsed.contains_character = containsMatch[1];
    const filters = {};
    if (parsed.is_palindrome !== undefined) filters["properties.is_palindrome"] = parsed.is_palindrome;
    if (parsed.word_count) filters["properties.word_count"] = parsed.word_count;
    if (parsed.min_length) filters["properties.length"] = { $gte: parsed.min_length };
    if (parsed.contains_character) filters.value = { $regex: parsed.contains_character, $options: "i" };
    const data = await StringModel.find(filters);
    if (!Object.keys(parsed).length) return res.status(400).json({ message: "Unable to parse natural language query" });
    res.status(200).json({
      data,
      count: data.length,
      interpreted_query: {
        original: query,
        parsed_filters: parsed
      }
    });
  } catch {
    res.status(422).json({ message: "Query parsed but resulted in conflicting filters" });
  }
});

router.delete("/strings/:string_value", async (req, res) => {
  try {
    const { string_value } = req.params;
    const deleted = await StringModel.findOneAndDelete({ value: string_value });
    if (!deleted) return res.status(404).json({ message: "String not found" });
    res.status(204).send();
  } catch {
    res.status(500).json({ message: "Server error, try again later" });
  }
});

module.exports = router;
