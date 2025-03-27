import OpenAI from 'openai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the root .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export const generateEducationBullets = async (req, res) => {
    const educationData = req.body;
    
    try {
        const prompt = `
            As an expert resume writer, generate 2 compelling bullet points for the following education entry:
            School: ${educationData.school}
            Location: ${educationData.location}
            Degree: ${educationData.degree}
            Field of Study: ${educationData.fieldOfStudy}
            Start Date: ${educationData.startDate}
            End Date: ${educationData.endDate}

            Focus on academic achievements, relevant coursework, or special projects.
            Format the response as a JSON array of exactly 2 strings.
            Example format: ["First bullet point", "Second bullet point"]
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are an expert resume writer focusing on education achievements." },
                { role: "user", content: prompt }
            ],
            temperature: 0.7
        });

        const bullets = JSON.parse(response.choices[0].message.content.trim());
        return res.json({ bullets });
    } catch (e) {
        console.error("Error generating education bullet points:", e);
        return res.status(500).json({ error: `Failed to generate bullet points: ${e.message}` });
    }
};

export const generateExperienceBullets = async (req, res) => {
    const experienceData = req.body;
    
    try {
        const prompt = `
            As an expert resume writer, generate 2 compelling bullet points for the following work experience:
            Title: ${experienceData.title}
            Company: ${experienceData.company}
            Location: ${experienceData.location}
            Start Date: ${experienceData.startDate}
            End Date: ${experienceData.endDate}
            Current Position: ${experienceData.isCurrentPosition}

            Focus on quantifiable achievements, responsibilities, and impact.
            Format the response as a JSON array of exactly 2 strings.
            Example format: ["First bullet point", "Second bullet point"]
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are an expert resume writer focusing on professional achievements." },
                { role: "user", content: prompt }
            ],
            temperature: 0.7
        });

        const bullets = JSON.parse(response.choices[0].message.content.trim());
        return res.json({ bullets });
    } catch (e) {
        console.error("Error generating experience bullet points:", e);
        return res.status(500).json({ error: `Failed to generate bullet points: ${e.message}` });
    }
};

export const generateCustomBullets = async (req, res) => {
    const customData = req.body;
    
    try {
        const prompt = `
            As an expert resume writer, generate 2 compelling bullet points for the following custom section entry:
            Title: ${customData.title}
            Subtitle: ${customData.subtitle}
            Location: ${customData.location}
            Start Date: ${customData.startDate}
            End Date: ${customData.endDate}

            Focus on relevant achievements and details that enhance the resume.
            Format the response as a JSON array of exactly 2 strings.
            Example format: ["First bullet point", "Second bullet point"]
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are an expert resume writer focusing on achievements and accomplishments." },
                { role: "user", content: prompt }
            ],
            temperature: 0.7
        });

        const bullets = JSON.parse(response.choices[0].message.content.trim());
        return res.json({ bullets });
    } catch (e) {
        console.error("Error generating custom bullet points:", e);
        return res.status(500).json({ error: `Failed to generate bullet points: ${e.message}` });
    }
}; 