import Resume from '../models/Resume.js';
import jwt from 'jsonwebtoken';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

export const createResume = async (req, res) => {
  try {
    const resume = await Resume.create({
      userId: req.user._id,
      title: req.body.title
    });
    res.status(201).json({ resume });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateResume = async (req, res) => {
  try {
    let updateData = {};

    if (req.body.title) {
      updateData.title = req.body.title;
    }

    if (req.body.resumeData) {
      const parsedData = JSON.parse(req.body.resumeData);
      updateData = { ...updateData, ...parsedData };
    }

    // Handle image upload if exists
    if (req.file) {
      // For simplicity, converting image to base64
      const imageBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      if (!updateData.personal_info) updateData.personal_info = {};
      updateData.personal_info.image = imageBase64;
    }

    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: updateData },
      { new: true }
    );

    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.json({ resume });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    
    let userId = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        // invalid token ignored
      }
    }
    
    // Check if public or owner
    if (!resume.public && resume.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json({ resume });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Please upload a file' });
    
    const data = await pdfParse(req.file.buffer);
    const text = data.text;

    const prompt = `Extract the following information from the resume text into a JSON object. Ensure the keys match exactly:
{
  "personal_info": {"full_name": "", "email": "", "phone": "", "location": "", "profession": "", "linkedin": "", "website": ""},
  "professional_summary": "",
  "experience": [{"company": "", "position": "", "start_date": "", "end_date": "", "description": "", "is_current": false}],
  "education": [{"institution": "", "degree": "", "field": "", "graduation_date": "", "gpa": ""}],
  "project": [{"name": "", "type": "", "description": ""}],
  "skills": [{"name": "", "level": 5}]
}
Return ONLY valid JSON, nothing else. Resume text:\n\n${text.substring(0, 3000)}`;

    let parsedResume = {};
    try {
      const response = await fetch(process.env.OLLAMA_URL || 'http://127.0.0.1:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'mistral',
          prompt: prompt,
          stream: false,
          format: 'json'
        })
      });
      const aiData = await response.json();
      parsedResume = JSON.parse(aiData.response);
    } catch (aiError) {
      console.log('AI Extraction failed, falling back to empty fields', aiError);
    }

    const resume = await Resume.create({
      userId: req.user._id,
      title: req.body.title,
      ...parsedResume
    });

    res.status(201).json({ resume });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const aiEnhance = async (req, res) => {
  try {
    const { text, section } = req.body;
    let prompt = `Enhance the following text for a professional resume. Make it concise, impactful, and use strong action verbs. Return ONLY the enhanced text without any quotes or extra explanation. Text: ${text}`;
    
    if (section === 'summary') {
        prompt = `Enhance the following professional summary for a resume. Make it concise (3-4 sentences), impactful, highlighting key strengths and career objectives. Return ONLY the enhanced text. Text: ${text}`;
    }

    const response = await fetch(process.env.OLLAMA_URL || 'http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'mistral',
        prompt: prompt,
        stream: false
      })
    });
    
    const aiData = await response.json();
    res.json({ text: aiData.response.trim() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const atsScore = async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;
    
    // Convert resume data to a readable string for the prompt
    const resumeText = `
Name: ${resumeData.personal_info?.full_name || ''}
Profession: ${resumeData.personal_info?.profession || ''}
Summary: ${resumeData.professional_summary || ''}
Experience: ${resumeData.experience?.map(e => `${e.position} at ${e.company} (${e.start_date} - ${e.end_date}): ${e.description}`).join('\n')}
Education: ${resumeData.education?.map(e => `${e.degree} at ${e.universityName}`).join('\n')}
Projects: ${resumeData.project?.map(p => `${p.name}: ${p.description}`).join('\n')}
Skills: ${resumeData.skills?.map(s => s.name).join(', ')}
    `;

    const prompt = `You are an expert ATS (Applicant Tracking System). You are given a Resume and a Target Job Description. Calculate the ATS match score (0-100) based on how well the resume matches the job description. Consider keywords, skills, experience, and education. If no job description is provided, calculate a general ATS score based on resume best practices.

Provide the evaluation in JSON format strictly matching this structure:
{
  "score": 85,
  "strengths": ["string", "string"],
  "weaknesses": ["string", "string"],
  "missing_keywords": ["string", "string"]
}
Only return the valid JSON, no markdown formatting or extra text.

Target Job Description:
${jobDescription ? jobDescription.substring(0, 3000) : 'None provided'}

Resume:
${resumeText.substring(0, 3000)}`;

    const response = await fetch(process.env.OLLAMA_URL || 'http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'mistral',
        prompt: prompt,
        stream: false,
        format: 'json'
      })
    });
    
    const aiData = await response.json();
    const result = JSON.parse(aiData.response);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
