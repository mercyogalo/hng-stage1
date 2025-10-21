🧠 String Analyzer Service

A RESTful API that analyzes strings and stores their computed properties.

Built for HNG Backend Stage 1 Task (Backend Wizards).

🚀 Features

Analyze strings and compute:

✅ Length

✅ Palindrome check

✅ Unique character count

✅ Word count

✅ SHA-256 hash (for unique identification)

✅ Character frequency map

Retrieve, delete, and filter analyzed strings

Supports advanced filtering using query parameters

Ready for deployment on Railway, AWS, or similar hosts

🧱 Tech Stack

Node.js + Express

MongoDB + Mongoose

Crypto (SHA-256 hashing)

JavaScript (ES6)

⚙️ Setup Instructions
1️⃣ Clone the Repository
git clone https://github.com/your-username/string-analyzer-service.git
cd string-analyzer-service

2️⃣ Install Dependencies
npm install

3️⃣ Create .env File

Create a .env file in the project root with:

PORT=3000
MONGO_URI=your_mongodb_connection_string


Example MongoDB connection string (from MongoDB Atlas):

MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/strings

4️⃣ Start the Server
npm start


Server runs at:

http://localhost:5000

📡 API Endpoints
🔹 1. Create / Analyze String

POST /strings

Request Body
{
  "value": "madam"
}

Success Response (201 Created)
{
  "id": "4c056ddf0cb3df6a4aab72b3f5a219d...",
  "value": "madam",
  "properties": {
    "length": 5,
    "is_palindrome": true,
    "unique_characters": 3,
    "word_count": 1,
    "sha256_hash": "4c056ddf0cb3df6a4aab72b3f5a219d...",
    "character_frequency_map": {
      "m": 2,
      "a": 2,
      "d": 1
    }
  },
  "created_at": "2025-10-21T18:00:00Z"
}

Error Responses
Code	Message
400	Invalid request body
409	String already exists
422	Invalid data type for value
🔹 2. Get Specific String

GET /strings/:string_value

Example:
GET /strings/madam

Success Response
{
  "_id": "6726e20c0a9458e3c8432e21",
  "value": "madam",
  "properties": {
    "length": 5,
    "is_palindrome": true,
    "unique_characters": 3,
    "word_count": 1,
    "sha256_hash": "4c056ddf0cb3df6a4aab72b3f5a219d..."
  },
  "created_at": "2025-10-21T18:00:00Z"
}

Error Response
Code	Message
404	String not found
🔹 3. Get All Strings with Filtering

GET /strings

Query Parameters
Parameter	Type	Description
is_palindrome	boolean	true / false
min_length	integer	minimum string length
max_length	integer	maximum string length
word_count	integer	exact word count
contains_character	string	single character to search for
Example:
GET /strings?is_palindrome=true&min_length=3&contains_character=a

Example Response
{
  "data": [
    {
      "_id": "6726e20c0a9458e3c8432e21",
      "value": "madam",
      "properties": { /* ... */ },
      "created_at": "2025-10-21T18:00:00Z"
    }
  ],
  "count": 1,
  "filters_applied": {
    "is_palindrome": true,
    "min_length": 3,
    "contains_character": "a"
  }
}

Error Responses
Code	Message
400	Invalid query parameter values or types
🔹 4. Delete String

DELETE /strings/:string_value

Example:
DELETE /strings/madam

Response:

204 No Content

Error Responses
Code	Message
404	String not found
🔹 5. (Optional Bonus) Natural Language Filtering

GET /strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings

Example Response
{
  "data": [ /* ... */ ],
  "count": 3,
  "interpreted_query": {
    "original": "all single word palindromic strings",
    "parsed_filters": {
      "word_count": 1,
      "is_palindrome": true
    }
  }
}

🧪 Testing

Use Postman, Insomnia, or curl to test endpoints.

Example:

curl -X POST http://localhost:5000/strings \
  -H "Content-Type: application/json" \
  -d '{"value": "racecar"}'




