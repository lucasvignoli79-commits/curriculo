
import { GoogleGenAI, Type } from "@google/genai";
import { ResumeFormData, GeneratedResume, PhotoStyle } from "../types";

const SYSTEM_INSTRUCTION = `
VocÃÂª ÃÂ© o Curriculum Master IA, o mais renomado especialista em recrutamento e design de currÃÂ­culos do Brasil.

SUA MISSÃÂO:
1. Analisar profundamente os dados fornecidos pelo usuÃÂ¡rio.
2. Gerar um currÃÂ­culo PROFISSIONAL, DETALHADO, porÃÂ©m CURTO e DIRETO.
3. O texto deve ser extremamente LIMPO e ORGANIZADO.

REGRAS CRÃÂTICAS DE FORMATAÃÂÃÂO:
- NÃÂO utilize asteriscos (*), hÃÂ­fens (-), ou sÃÂ­mbolos no inÃÂ­cio das frases desnecessariamente.
- Separe as informaÃÂ§ÃÂµes por tÃÂ­tulos claros (ex: # TÃÂ­tulo).
- NÃÂO use negrito ou itÃÂ¡lico atravÃÂ©s de sÃÂ­mbolos markdown no JSON estruturado.
- O campo 'markdown' deve conter a versÃÂ£o completa formatada para impressÃÂ£o.

REGRAS DE CONTEÃÂDO:
- RESUMO: ParÃÂ¡grafo ÃÂºnico, impactante, 3-4 linhas.
- EXPERIÃÂNCIA: Narrativa profissional com verbos de aÃÂ§ÃÂ£o.
- IDIOMA: PortuguÃÂªs do Brasil (PT-BR).
`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    markdown: { type: Type.STRING, description: "VersÃÂ£o formatada em markdown para visualizaÃÂ§ÃÂ£o direta." },
    suggestions: { type: Type.STRING, description: "Dicas de melhoria para o usuÃÂ¡rio." },
    structured: {
      type: Type.OBJECT,
      properties: {
        fullName: { type: Type.STRING },
        role: { type: Type.STRING },
        summary: { type: Type.STRING },
        contact: {
          type: Type.OBJECT,
          properties: {
            email: { type: Type.STRING },
            phone: { type: Type.STRING },
            location: { type: Type.STRING },
            linkedin: { type: Type.STRING },
            website: { type: Type.STRING }
          }
        },
        skills: { type: Type.ARRAY, items: { type: Type.STRING } },
        languages: { type: Type.ARRAY, items: { type: Type.STRING } },
        experience: { type: Type.STRING },
        education: { type: Type.STRING },
        projects: { type: Type.STRING },
        certifications: { type: Type.STRING }
      },
      required: ["fullName", "summary", "experience", "education", "skills"]
    }
  },
  required: ["markdown", "structured", "suggestions"],
};

const cleanJsonString = (jsonStr: string): string => {
  return jsonStr.replace(/```json\n?|```/g, "").trim();
};

export const generateResumeFromScratch = async (data: ResumeFormData, isApprentice: boolean = false): Promise<GeneratedResume> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'FAKE_API_KEY_FOR_DEVELOPMENT' });
  const prompt = `Gere um currÃÂ­culo ${isApprentice ? 'Jovem Aprendiz' : 'Profissional'} com base nestes dados: ${JSON.stringify(data)}`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { 
        systemInstruction: SYSTEM_INSTRUCTION, 
        responseMimeType: "application/json", 
        responseSchema: RESPONSE_SCHEMA
      }
    });
    
    const text = response.text;
    return JSON.parse(cleanJsonString(text)) as GeneratedResume;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw new Error("Falha ao gerar currÃÂ­culo. Tente novamente.");
  }
};

export const optimizeResume = async (textInput: string, imageBase64?: string, mimeType?: string): Promise<GeneratedResume> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'FAKE_API_KEY_FOR_DEVELOPMENT' });
  const parts: any[] = [{ text: `Otimize o seguinte currÃÂ­culo para ser aprovado em sistemas ATS: ${textInput}` }];
  
  if (imageBase64 && mimeType) {
    parts.push({ inlineData: { data: imageBase64, mimeType } });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts },
      config: { 
        systemInstruction: SYSTEM_INSTRUCTION, 
        responseMimeType: "application/json", 
        responseSchema: RESPONSE_SCHEMA 
      }
    });
    return JSON.parse(cleanJsonString(response.text)) as GeneratedResume;
  } catch (error) {
    console.error("Gemini Optimization Error:", error);
    throw new Error("Falha ao otimizar currÃÂ­culo.");
  }
};

export const generateProfessionalHeadshot = async (imageBase64: string, style: PhotoStyle): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'FAKE_API_KEY_FOR_DEVELOPMENT' });
  const stylePrompts = {
    classic: "executive portrait, studio lighting, clean grey background, professional suit, sharp focus",
    modern: "minimalist bright background, smart casual clothing, professional lighting, soft shadows",
    corporate: "blurred high-end office background, formal business attire, executive profile",
    bokeh: "blurred natural outdoor background, soft daylight, professional headshot",
    bw: "elegant black and white, dramatic lighting, high contrast, professional corporate style"
  };

  const prompt = `Transforme esta pessoa em um retrato profissional de alta qualidade. Estilo: ${stylePrompts[style]}. Mantenha a identidade idÃÂªntica. SaÃÂ­da: apenas imagem.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { 
        parts: [
          { inlineData: { data: imageBase64, mimeType: 'image/jpeg' } }, 
          { text: prompt }
        ] 
      },
      config: { imageConfig: { aspectRatio: "1:1" } }
    });
    
    const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (imagePart?.inlineData?.data) {
      return imagePart.inlineData.data;
    }
    throw new Error("Nenhuma imagem gerada pela IA.");
  } catch (error) {
    console.error("Gemini Image Error:", error);
    throw error;
  }
};

export const extractTextFromImage = async (base64: string, mimeType: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'FAKE_API_KEY_FOR_DEVELOPMENT' });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { 
      parts: [
        { inlineData: { data: base64, mimeType } }, 
        { text: "Extraia todo o texto deste currÃÂ­culo e organize por seÃÂ§ÃÂµes." }
      ] 
    }
  });
  return response.text;
};

export const extractTextFromPdf = async (base64: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'FAKE_API_KEY_FOR_DEVELOPMENT' });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { 
      parts: [
        { inlineData: { data: base64, mimeType: 'application/pdf' } }, 
        { text: "Extraia todo o texto deste currÃÂ­culo PDF de forma organizada." }
      ] 
    }
  });
  return response.text;
};

export const searchJobs = async (role: string, location: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'FAKE_API_KEY_FOR_DEVELOPMENT' });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Encontre 5 vagas de emprego reais e atuais para o cargo de "${role}" em "${location}". Liste os detalhes e forneÃÂ§a links reais.`,
    config: { tools: [{ googleSearch: {} }] }
  });
  
  return {
    rawText: response.text,
    chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const analyzeJobMatch = async (resumeText: string, jobDescription: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'FAKE_API_KEY_FOR_DEVELOPMENT' });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analise o match entre este currÃÂ­culo e esta vaga.\nCURRÃÂCULO: ${resumeText}\nVAGA: ${jobDescription}`,
    config: { 
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["score", "missingKeywords", "suggestions"]
      }
    }
  });
  return JSON.parse(cleanJsonString(response.text));
};

export const checkATS = async (resumeText: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'FAKE_API_KEY_FOR_DEVELOPMENT' });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `FaÃÂ§a uma auditoria de legibilidade ATS (Applicant Tracking Systems) para este currÃÂ­culo: ${resumeText}`,
    config: { 
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          errors: { type: Type.ARRAY, items: { type: Type.STRING } },
          warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
          keywordsFound: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["score", "errors", "warnings", "keywordsFound"]
      }
    }
  });
  return JSON.parse(cleanJsonString(response.text));
};

export const generateLinkedInProfile = async (resumeText: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'FAKE_API_KEY_FOR_DEVELOPMENT' });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Gere um perfil otimizado para o LinkedIn com base neste currÃÂ­culo: ${resumeText}`,
    config: { 
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          headline: { type: Type.STRING },
          aboutShort: { type: Type.STRING },
          aboutMedium: { type: Type.STRING },
          aboutLong: { type: Type.STRING },
          skills: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["headline", "aboutShort", "aboutMedium", "aboutLong", "skills"]
      }
    }
  });
  return JSON.parse(cleanJsonString(response.text));
};

export const simulateInterview = async (role: string, level: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'FAKE_API_KEY_FOR_DEVELOPMENT' });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Simule perguntas de entrevista para o cargo de ${role} nÃÂ­vel ${level}. ForneÃÂ§a a resposta ideal para cada uma.`,
    config: { 
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          feedback: { type: Type.STRING },
          commonQuestions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { question: { type: Type.STRING }, idealAnswer: { type: Type.STRING } } } },
          techQuestions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { question: { type: Type.STRING }, idealAnswer: { type: Type.STRING } } } },
          hardQuestions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { question: { type: Type.STRING }, idealAnswer: { type: Type.STRING } } } }
        },
        required: ["feedback", "commonQuestions", "techQuestions", "hardQuestions"]
      }
    }
  });
  return JSON.parse(cleanJsonString(response.text));
};

export const getCourseRecommendations = async (area: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'FAKE_API_KEY_FOR_DEVELOPMENT' });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Recomende 5 cursos gratuitos e verificados para a ÃÂ¡rea de ${area}. Use plataformas brasileiras estÃÂ¡veis.`,
    config: { 
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          courses: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                provider: { type: Type.STRING },
                difficulty: { type: Type.STRING },
                impact: { type: Type.STRING },
                howToList: { type: Type.STRING },
                link: { type: Type.STRING }
              },
              required: ["name", "provider", "link"]
            }
          }
        }
      }
    }
  });
  return JSON.parse(cleanJsonString(response.text));
};
