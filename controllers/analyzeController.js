import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const openaiApiKey = process.env.OPENAI_API_KEY;
if (!openaiApiKey) {
    throw new Error("API key missing.");
}

const openai = new OpenAI({ apiKey: openaiApiKey });

// Upload folder setup
const UPLOAD_FOLDER = 'uploads';
if (!fs.existsSync(UPLOAD_FOLDER)) {
    fs.mkdirSync(UPLOAD_FOLDER);
}

// Allowed Extensions
const ALLOWED_EXTENSIONS = ['pdf', 'txt'];

function allowedFile(filename) {
    const ext = path.extname(filename).toLowerCase().substring(1);
    return ALLOWED_EXTENSIONS.includes(ext);
}

async function extractTextFromPdf(pdfPath) {
    try {
        const dataBuffer = fs.readFileSync(pdfPath);
        const data = await pdfParse(dataBuffer);
        return data.text.trim() || "No extractable text found.";
    } catch (e) {
        return `Error extracting text: ${e.message}`;
    }
}

// Controller function for resume analysis
export const analyzeResume = async (req, res) => {
    console.log("Analyzing resume...");

    if (!req.file) {
        console.log("No file in request.");
        return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.file;  // Multer will automatically save the file
    console.log(`File received: ${file.originalname}`);

    if (!allowedFile(file.originalname)) {
        return res.status(400).json({ error: "Invalid file type. Only PDF or TXT allowed." });
    }

    const filepath = file.path;  // Use the file path provided by multer
    console.log(`File saved at: ${filepath}`);

    let resumeText;
    if (file.originalname.endsWith('.pdf')) {
        resumeText = await extractTextFromPdf(filepath);
    } else {
        resumeText = fs.readFileSync(filepath, 'utf-8');
    }

    console.log("Extracted resume text.");

    // OpenAI prompt
    const prompt = `
        You are an expert career coach and resume reviewer. Analyze the following resume and provide structured feedback:

        1. **Overall Score**: Numerical score (0-100).
        2. **Keyword Match**: Alignment with job descriptions (percentage 0-100%).
        3. **Formatting**: Clarity, readability, structure (percentage 0-100%).
        4. **Content Quality**: Grammar, conciseness, professionalism (percentage 0-100%).
        5. **Suggestions for Improvement**: Three key bullet points.

        Resume:
        ----------------------
        ${resumeText}
        ----------------------

        Respond strictly in JSON format:
        {
        "overall_score": 85,
        "keyword_match": 90,
        "formatting": 80,
        "content_quality": 75,
        "suggestions": [
            "Improve formatting in the skills section",
            "Use more action-oriented language",
            "Add measurable achievements"
        ]
        }
    `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are an expert career coach and resume reviewer." },
                { role: "user", content: prompt }
            ],
            temperature: 0.5
        });

        console.log("Full OpenAI response:", response);

        if (!response || !response.choices || response.choices.length === 0) {
            throw new Error("Invalid response from OpenAI");
        }

        // Parse response as JSON
        const feedback = JSON.parse(response.choices[0].message.content.trim());
        console.log("Feedback generated:", feedback);

        fs.unlinkSync(filepath); // Remove file after processing
        return res.json(feedback);

    } catch (e) {
        console.error("Error in OpenAI API call:", e.response ? e.response.data : e.message);
        fs.unlinkSync(filepath);
        return res.status(500).json({ error: `Failed to generate feedback: ${e.message}` });
    }
};