
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedTest, Subject, Grade } from "../types";

export const generateTestWithAI = async (
  subject: Subject,
  grade: Grade,
  school: string,
  topics: string
): Promise<GeneratedTest> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const prompt = `Bạn là chuyên gia giáo dục THCS. Hãy tạo 01 đề kiểm tra định kì môn ${subject}, khối ${grade} cho trường ${school}.
  Nội dung tập trung vào: ${topics}.
  
  YÊU CẦU BẮT BUỘC:
  1. Thang điểm: 5.0 (Tổng 5 điểm).
  2. Tỉ lệ: 70% Trắc nghiệm (3.5 điểm - thường 14 câu, mỗi câu 0.25) và 30% Tự luận (1.5 điểm - 1 hoặc 2 câu).
  3. Đúng mẫu CV 7991/BGDĐT-GDTrH.
  4. Ma trận và bảng đặc tả chi tiết.
  5. Đề thi phải có tính giáo dục, bám sát CT GDPT 2018.
  
  Kết quả trả về định dạng JSON theo cấu trúc yêu cầu.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          school: { type: Type.STRING },
          subject: { type: Type.STRING },
          grade: { type: Type.STRING },
          time: { type: Type.NUMBER },
          scale: { type: Type.NUMBER },
          matrix: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                tt: { type: Type.NUMBER },
                topic: { type: Type.STRING },
                content: { type: Type.STRING },
                tnkq: {
                  type: Type.OBJECT,
                  properties: {
                    know: { type: Type.NUMBER },
                    understand: { type: Type.NUMBER },
                    apply: { type: Type.NUMBER }
                  }
                },
                essay: {
                  type: Type.OBJECT,
                  properties: {
                    know: { type: Type.NUMBER },
                    understand: { type: Type.NUMBER },
                    apply: { type: Type.NUMBER }
                  }
                },
                totalQuestions: { type: Type.NUMBER },
                totalPoints: { type: Type.NUMBER }
              }
            }
          },
          specTable: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                tt: { type: Type.NUMBER },
                topic: { type: Type.STRING },
                content: { type: Type.STRING },
                learningOutcomes: { type: Type.STRING },
                tnkq: {
                  type: Type.OBJECT,
                  properties: {
                    know: { type: Type.STRING },
                    understand: { type: Type.STRING },
                    apply: { type: Type.STRING }
                  }
                },
                essay: {
                  type: Type.OBJECT,
                  properties: {
                    know: { type: Type.STRING },
                    understand: { type: Type.STRING },
                    apply: { type: Type.STRING }
                  }
                }
              }
            }
          },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.NUMBER },
                type: { type: Type.STRING },
                level: { type: Type.STRING },
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                answer: { type: Type.STRING },
                explanation: { type: Type.STRING },
                points: { type: Type.NUMBER }
              }
            }
          }
        }
      }
    }
  });

  return JSON.parse(response.text);
};
