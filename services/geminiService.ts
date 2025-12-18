
import { GoogleGenAI, Type } from "@google/genai";
import { ResumeFormData, GeneratedResume, PhotoStyle } from "../types";

const SYSTEM_INSTRUCTION = `
VocÃª Ã© o Curriculum Master IA, o mais renomado especialista em recrutamento e design de currÃ­culos do Brasil.

SUA MISSÃO:
1. Analisar profundamente os dados fornecidos pelo usuÃ¡rio.
2. Gerar um currÃ­culo PROFISSIONAL, DETALHADO, porÃ©m CURTO e DIRETO.
3. O texto deve ser extremamente LIMPO e ORGANIZADO.

REGRAS CRÃTICAS DE FORMATAÃÃO:
- NÃO utilize asteriscos (*), hÃ­fens (-), ou sÃ­mbolos no inÃ­cio das frases desnecessariamente.
- Separe as informaÃ§Ãµes por tÃ­tulos claros (ex: # TÃ­tulo).
- NÃO use negrito ou itÃ¡lico atravÃ©s de sÃ­mbolos markdown no JSON estruturado.
- O campo 'markdown' deve conter a versÃ£o completa formatada para impressÃ£o.

REGRAS DE CONTEÃDO:
- RESUMO: ParÃ¡grafo Ãºnico, impactante, 3-4 linhas.
- EXPERIÃNCIA: Narrativa profissional com verbos de aÃ§Ã£o.
- IDIOMA: PortuguÃªs do Brasil (PT-BR).
`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    markdown: { type: Type.STRING, description: "VersÃ£o formatada em markdown para visualizaÃ§Ã£o direta." },
    suggestions: { type: Type.STRING, description: "Dicas de melhoria para o usuÃ¡rio." },
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
  const prompt = `Gere um currÃ­culo ${isApprentice ? 'Jovem Aprendiz' : 'Profissional'} com base nestes dados: ${JSON.stringify(data)}`;
  
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
    
    return JSON.parse(cleanJsonString(response.text)) as GeneratedResume;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};

export const optimizeResume = async (textInput: string, imageBase64?: string, mimeType?: string): Promise<GeneratedResume> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'FAKE_API_KEY_FOR_DEVELOPMENT' });
  const parts: any[] = [{ text: `Otimize o seguinte currÃ­culo para ser aprovado em sistemas ATS: ${textInput}` }];
  
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
    throw error;
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

  const prompt = `Transforme esta pessoa em um retrato profissional de alta qualidade. Estilo: ${stylePrompts[style]}. Mantenha a identidade facial idÃªntica. SaÃ­da: apenas imagem.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { 
        parts: [
          { inlineData: { data: imageBase64, mimeType: 'image/jpeg' } }, 
          { text: prompt }
        ] 
      },
      config: { 
        imageConfig: { aspectRatio: "1:1", imageSize: "1K" } 
      }
    });
    
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    throw new Error("Nenhuma imagem gerada.");
  } catch (error) {
    console.error("Gemini Image Error:", error);
    throw error;
  }
};

export const searchJobs = async (role: string, location: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'FAKE_API_KEY_FOR_DEVELOPMENT' });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Encontre 5 vagas de emprego reais e atuais para o cargo de "${role}" em "${location}". Liste os detalhes e forneÃ§a links reais.`,
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
    contents: `Analise o match entre este currÃ­culo e esta vaga.\nCURRÃCULO: ${resumeText}\nVAGA: ${jobDescription}`,
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

export const extractTextFromImage = async (base64: string, mimeType: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'FAKE_API_KEY_FOR_DEVELOPMENT' });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { 
      parts: [
        { inlineData: { data: base64, mimeType } }, 
        { text: "Extraia todo o texto deste currÃ­culo e organize por seÃ§Ãµes." }
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
        { text: "Extraia todo o texto deste currÃ­culo PDF de forma organizada." }
      ] 
    }
  });
  return response.text;
};

export const checkATS = async (resumeText: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'FAKE_API_KEY_FOR_DEVELOPMENT' });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `FaÃ§a uma auditoria ATS para: ${resumeText}`,
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

// Fix: Export generateLinkedInProfile function
export const generateLinkedInProfile = async (resumeText: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'FAKE_API_KEY_FOR_DEVELOPMENT' });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Com base no currÃ­culo abaixo, gere um perfil otimizado para o LinkedIn:\n\n${resumeText}`,
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

// Fix: Export simulateInterview function
export const simulateInterview = async (role: string, level: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'FAKE_API_KEY_FOR_DEVELOPMENT' });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Simule uma entrevista de emprego para o cargo de "${role}" no nÃ­vel "${level}". Gere perguntas comuns, tÃ©cnicas e desafiadoras com as respostas ideais.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          feedback: { type: Type.STRING },
          commonQuestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                idealAnswer: { type: Type.STRING }
              },
              required: ["question", "idealAnswer"]
            }
          },
          techQuestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                idealAnswer: { type: Type.STRING }
              },
              required: ["question", "idealAnswer"]
            }
          },
          hardQuestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                idealAnswer: { type: Type.STRING }
              },
              required: ["question", "idealAnswer"]
            }
          }
        },
        required: ["feedback", "commonQuestions", "techQuestions", "hardQuestions"]
      }
    }
  });
  return JSON.parse(cleanJsonString(response.text));
};

// Fix: Export getCourseRecommendations function
export const getCourseRecommendations = async (area: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'FAKE_API_KEY_FOR_DEVELOPMENT' });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Recomende 5 cursos gratuitos reais e verificados para a Ã¡rea de "${area}" em plataformas como Bradesco, SEBRAE, FGV, etc.`,
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
              required: ["name", "provider", "difficulty", "impact", "howToList", "link"]
            }
          }
        },
        required: ["courses"]
      }
    }
  });
  return JSON.parse(cleanJsonString(response.text));
};
