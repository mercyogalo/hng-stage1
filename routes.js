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

    
    if (!value) {
      return res.status(400).json({ message: "Missing 'value' field" });
    }

    if (typeof value !== "string") {
      return res.status(422).json({ message: "'value' must be a string" });
    }

  
    const existing = await StringModel.findOne({ value });
    if (existing) {
      return res.status(409).json({ message: "String already exists in the system" });
    }

  
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
    console.error(error);
    res.status(500).json({ message: "Server error, try again later" });
  }
});


router.get("/strings/:string_value", async (req, res) => {
  try {
    const { string_value } = req.params;

   
    const stringData = await StringModel.findOne({ value: string_value });

    if (!stringData) {
      return res.status(404).json({ message: "String does not exist in the system" });
    }

    res.status(200).json(stringData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, try again later" });
  }
});


router.delete("/strings/:string_value", async (req, res) => {
  try {
    const { string_value } = req.params;

    const deleted = await StringModel.findOneAndDelete({ value: string_value });

    if (!deleted) {
      return res.status(404).json({ message: "String not found" });
    }

    return res.status(204).send(); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, try again later" });
  }
});

module.exports = router;
