const mongoose=require("mongoose");
const { Schema }=mongoose;


const stringSchema=new Schema({
   value: { type: String, required: true, unique: true },
   properties: {
    length: Number,
    is_palindrome: Boolean,
    unique_characters: Number,
    word_count: Number,
    sha256_hash: String,
    character_frequency_map: Object,
  },
  created_at: { type: Date, default: Date.now },
})

module.exports=mongoose.model("StringModel", stringSchema);