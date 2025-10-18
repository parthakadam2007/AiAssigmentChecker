require('dotenv').config();

const { createGrade } = require('../models/classModels');
const { getContext } = require("../models/teacherModels")

const { readFile } = require('node:fs/promises');
const { getTextExtractor } = require('office-text-extractor');
const path = require('path');
const extractor = getTextExtractor();

const { GoogleGenAI } = require("@google/genai");

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

const { Worker } = require('bullmq');
const Redis = require('ioredis');

// Redis connection
const connection = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  maxRetriesPerRequest: null,
});
console.log(process.env.REDIS_HOST,
  process.env.REDIS_PORT,
)

// Create BullMQ Worker
const assignmentWorker = new Worker(
  'assignments',
  async (job) => {
    const data = job.data;
    // data[0].file_link 

    const assignmentText = await extractor.extractText({ input: data[0].file_link, type: 'url' })
    const context = await getContext(data[0].assignment_id);


    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: assignmentText,
      config: {
        systemInstruction: `You are an assignment checker. Your task is to review and provide feedback on student assignments.
              You have to grade the assignment on a scale of 0 to points mensioned and provide feedback.
              The output should be in the following JSON format:
              make this json short about one line each or more short(GIVE JSON IN ONE LINE DO NOT INCLUDE SPACE OR "n") and to the point.
                   {
                    "grade": 8,
                    "corrections": "all things that are worng and there correct answer",
                    "feedback": "Well-structured but needs more examples.",
                    "suggestions": "Add more examples to improve clarity.",
                    "strengths": "Good understanding of the topic.",
                    "weaknesses": "Some sections lack depth.",
                    "improvementAreas": "Provide detailed explanations and examples."
                  }



              The feedback should be constructive and helpful for the student to improve their work.
              You will also be given an evaluation criteria which you must follow while grading:
               ${context}
              `,
      },
    });
        // AI check
    const url = 'https://api.gowinston.ai/v2/ai-content-detection';
    const options = {
      method: 'POST',
       headers: {
      Authorization: 'Bearer voXN4aTtCnBX2KgCzUzAkDckofjJoPS6jqBVuzXp66fdc6c0',
      'Content-Type': 'application/json'
    },
      body: `{"file":"${data[0].file_link}"}`
    };
    let aicheck = {};
    try {
      const response = await fetch(url, options);
       aicheck = await response.json();
      console.log(aicheck);
    } catch (error) {
      console.error(error);
    }

    //Plagiarism check
    const urlPlagiarism = 'https://api.gowinston.ai/v2/plagiarism';
    const optionsPlagiarism = {
      method: 'POST',
       headers: {
      Authorization: 'Bearer voXN4aTtCnBX2KgCzUzAkDckofjJoPS6jqBVuzXp66fdc6c0',
      'Content-Type': 'application/json'
    },
      body: `{"file":"${data[0].file_link}"}`
    };
    let Plagiarismcheck = {};
    try {
      const response = await fetch(urlPlagiarism, optionsPlagiarism);
      Plagiarismcheck = await response.json();
      console.log('---->plagiarism',Plagiarismcheck);
    } catch (error) {
      console.error(error);
    }

    // Extract JSON from response.text using regex

    const regex = /\{[\s\S]*?\}/;
    const match = response.text.match(regex);

    if (match) {
      // Use match[0] and clean it
      let cleaned = match[0]
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .replace(/\n/g, " ")
        .replace(/\s+/g, " ")
        .replace(/,\s*}/g, "}")   // remove trailing commas before }
        .replace(/,\s*]/g, "]")   // remove trailing commas before ]
        .replace(/=\s*/g, ": ");  // fix = instead of :

      try {
        const jsonResponse = JSON.parse(cleaned);

        const feedback = jsonResponse.feedback || "No feedback provided";

        const rawGrade = jsonResponse.grade;
        let grade = parseInt(rawGrade);
        if (isNaN(grade)) grade = 0;

        console.log(
          `Feedback: ${feedback}, Grade: ${grade}, Submission ID: ${data[0].submission_id}`
        );

        await createGrade({
          obtained_grade: grade,
          student_id: data[0].student_id,
          feedback: jsonResponse.feedback || null,
          corrections: jsonResponse.corrections || null,
          suggestions: jsonResponse.suggestions || null,
          weaknesses: jsonResponse.weaknesses || null,
          improvementAreas: jsonResponse.improvementAreas || null,
          submission_id: data[0].submission_id,
          aiTextDetection: aicheck || null,
          plagiarism: Plagiarismcheck|| null
        });
      } catch (err) {
        console.error("JSON parse failed:", err, "\nCleaned text:", cleaned);
      }

    } else {
      console.log("No JSON found in response!");
    }





  },
  { connection }
);

assignmentWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed!`);
});
