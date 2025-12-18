
import { GoogleGenAI, Type } from "@google/genai";
import { ResumeFormData, GeneratedResume, PhotoStyle } from "../types";

const SYSTEM_INSTRUCTION = `
Você é o Curriculum Master IA, o mais renomado especialista em recrutamento e design de currículos do Brasil.

SUA MISSÃO:
1. Analisar profundamente os dados fornecidos pelo usuário.
2. Gerar um currículo PROFISSIONAL, DETALHADO, porém CURTO e DIRETO.
3. O texto deve ser extremamente LIMPO e ORGANIZADO.

REGRAS CRÍTICAS DE FORMATAÇÃO (NÃO NEGOCIÁVEIS):
- NÃO utilize asteriscos (*), hífens (-), símbolos ou caracteres especiais no início ou no fim das frases.
- NÃO utilize marcadores de lista (bullet points).
- Separe as informações apenas por quebras de linha e títulos claros.
- NÃO use negrito ou itálico através de símbolos (como **texto**).
- O texto deve estar pronto para uso, sem necessidade de limpeza manual de símbolos.

REGRAS DE CONTEÚDO:
- COMPREENSÃO: O resumo profissional deve ser denso e impactante, em um parágrafo único de 3 a 4 linhas.
- EXPERIÊNCIA: Descreva as responsabilidades de forma narrativa e profissional. Evite listas. Use verbos de ação.
- JOVEM APRENDIZ: Foque em potencial, educação e objetivos claros, mantendo a sobriedade e limpeza do texto.
- IDIOMA: Use apenas Português do Brasil (PT-BR).

REGRAS DE RETORNO:
- Retorne os dados ESTRUTURADOS (JSON).
- No campo "markdown", use apenas títulos com '#' e quebras de linha simples, sem qualquer outro símbolo de formatação.
`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    markdown: { type: Type.STRING },
    suggestions: { type: Type.STRING },
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

// Helper function to clean JSON strings from Markdown code blocks
const cleanJsonString = (jsonStr: string): string => {
  return jsonStr.replace(/```json\n?|```/g, "").trim();
};

export const generateResumeFromScratch = async (data: ResumeFormData, isApprentice: boolean = false): Promise<GeneratedResume> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const { photo, ...textData } = data;
  
  const prompt = `GERAR CURRÍCULO LIMPO E DIRETO. MODO: ${isApprentice ? 'JOVEM APRENDIZ' : 'PROFISSIONAL'}. DADOS DO USUÁRIO: ${JSON.stringify(textData)}. Lembre-se: SEM SÍMBOLOS, SEM ASTERISCOS, SEM LISTAS COM HIFENS. Texto puro e profissional.`;
  
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
    return JSON.parse(cleanJsonString(response.text || '{}')) as GeneratedResume;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const optimizeResume = async (textInput: string, imageBase64?: string, mimeType?: string): Promise<GeneratedResume> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `OTIMIZAR CURRÍCULO. Remova todos os símbolos de lista, asteriscos e caracteres especiais. Torne o texto direto, profissional e limpo. CONTEÚDO: ${textInput}`;
  const parts: any[] = [{ text: prompt }];
  
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
    return JSON.parse(cleanJsonString(response.text || '{}')) as GeneratedResume;
  } catch (error) {
    console.error("Gemini Optimization Error:", error);
    throw error;
  }
};

export const generateProfessionalHeadshot = async (imageBase64: string, style: PhotoStyle): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const stylePrompts = {
    classic: "executive portrait, studio lighting, clean grey background, professional suit, sharp focus",
    modern: "minimalist bright background, smart casual clothing, professional lighting, soft shadows",
    corporate: "blurred high-end office background, formal business attire, executive profile, cinematic lighting",
    bokeh: "blurred natural outdoor background, soft daylight, professional headshot, friendly and trustworthy expression",
    bw: "elegant black and white, dramatic lighting, high contrast, professional corporate style"
  };

  const prompt = `Act as a professional photo editor. Transform this person's photo into a high-quality professional corporate headshot. 
  Style requested: ${stylePrompts[style]}. 
  Keep the person's facial identity exactly as is, but optimize the lighting, replace the background with a professional one, and adjust clothing to match the corporate style. 
  Output ONLY the transformed image.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { 
        parts: [
          { inlineData: { data: imageBase64, mimeType: 'image/jpeg' } }, 
          { text: prompt }
        ] 
      }
    });
    
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    throw new Error("Nenhuma imagem gerada pela IA.");
  } catch (error) {
    console.error("Gemini Photo Gen Error:", error);
    throw error;
  }
};

export const extractTextFromImage = async (base64: string, mimeType: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [{ inlineData: { data: base64, mimeType } }, { text: "Extraia todo o texto deste currículo de forma organizada." }] }
  });
  return response.text || "";
};

export const extractTextFromPdf = async (base64: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [{ inlineData: { data: base64, mimeType: 'application/pdf' } }, { text: "Extraia todo o texto deste currículo PDF de forma organizada." }] }
  });
  return response.text || "";
};

export const analyzeJobMatch = async (resumeText: string, jobDescription: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analise a compatibilidade entre o currículo e a vaga abaixo.
    CURRÍCULO: ${resumeText}
    VAGA: ${jobDescription}
    Retorne um JSON com: { score: number, missingKeywords: string[], suggestions: string[] }`,
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
  return JSON.parse(cleanJsonString(response.text || '{}'));
};

export const checkATS = async (resumeText: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Realize um check de legibilidade ATS para o seguinte texto de currículo: ${resumeText}.
    Retorne um JSON com: { score: number, errors: string[], warnings: string[], keywordsFound: string[] }`,
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
  return JSON.parse(cleanJsonString(response.text || '{}'));
};

export const generateLinkedInProfile = async (resumeText: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Com base no currículo abaixo, gere um perfil otimizado para o LinkedIn.
    CURRÍCULO: ${resumeText}
    Retorne um JSON com: { headline: string, aboutShort: string, aboutMedium: string, aboutLong: string, skills: string[] }`,
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
  return JSON.parse(cleanJsonString(response.text || '{}'));
};

export const simulateInterview = async (role: string, level: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Simule uma entrevista de emprego para o cargo de ${role} (Nível: ${level}).
    Retorne um JSON com: { feedback: string, commonQuestions: Array<{question: string, idealAnswer: string}>, techQuestions: Array<{question: string, idealAnswer: string}>, hardQuestions: Array<{question: string, idealAnswer: string}> }`,
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
  return JSON.parse(cleanJsonString(response.text || '{}'));
};

export const getCourseRecommendations = async (area: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
  RECOMENDE 5 CURSOS ONLINE GRATUITOS para: ${area}.
  
  REGRAS CRÍTICAS PARA EVITAR LINKS QUEBRADOS:
  1. Use EXCLUSIVAMENTE os links de catálogos gerais das plataformas abaixo. NÃO INVENTE sub-páginas para cursos específicos.
  2. PLATAFORMAS E LINKS OBRIGATÓRIOS (USE EXATAMENTE ASSIM):
     - Fundação Bradesco: https://www.ev.org.br/cursos
     - SEBRAE: https://www.sebrae.com.br/sites/PortalSebrae/cursosonline
     - FGV Online: https://www5.fgv.br/fgvonline/Cursos/Gratuitos/
     - SENAI: https://www.portaldaindustria.com.br/senai/canais/educacao-profissional/cursos-gratuitos/
     - Google Ateliê Digital: https://learndigital.withgoogle.com/ateliedigital/courses
     - Microsoft Learn: https://learn.microsoft.com/pt-br/training/
  
  Retorne um JSON válido com o campo "courses" sendo um array de objetos: 
  { courses: [{ name, provider, difficulty, impact, howToList, link }] }
  `;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
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
  return JSON.parse(cleanJsonString(response.text || '{ "courses": [] }'));
};

export const searchJobs = async (role: string, location: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Encontre vagas de emprego reais para o cargo de "${role}" na região de "${location}". 
    Liste as vagas com título, empresa, salário (se disponível), descrição curta, fonte e link para candidatura.`,
    config: { 
        tools: [{ googleSearch: {} }] 
    }
  });

  // Extract text and grounding chunks as per guidelines
  const text = response.text || "";
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

  // Since response.text might not be JSON when using googleSearch tool, 
  // we attempt a second call to structure the information found if text is present,
  // or we parse the text manually. For reliability with the tool, we return the raw text and grounding.
  
  // Here we'll return a special format that the component can handle
  return { 
    rawText: text, 
    chunks: groundingChunks 
  };
};
