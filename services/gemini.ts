const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent';

export interface GeminiGenerateParams {
  apiKey: string;
  prompt: string;
  faceImagesBase64: string[];
}

export interface GeminiGenerateResult {
  success: boolean;
  imageBase64?: string;
  error?: string;
}

interface GeminiPart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

interface GeminiCandidate {
  content?: {
    parts?: GeminiPart[];
  };
}

interface GeminiResponse {
  candidates?: GeminiCandidate[];
  error?: {
    message?: string;
  };
}

export async function generateSceneImage({
  apiKey,
  prompt,
  faceImagesBase64,
}: GeminiGenerateParams): Promise<GeminiGenerateResult> {
  if (!apiKey) {
    return { success: false, error: 'Missing Gemini API key.' };
  }
  if (faceImagesBase64.length === 0) {
    return { success: false, error: 'At least one face photo is required.' };
  }

  try {
    const parts: GeminiPart[] = [
      { text: prompt },
      ...faceImagesBase64.map((data) => ({
        inlineData: { mimeType: 'image/jpeg', data },
      })),
    ];

    const response = await fetch(`${GEMINI_ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts }],
        generationConfig: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      }),
    });

    const json = (await response.json()) as GeminiResponse;

    if (!response.ok) {
      return {
        success: false,
        error: json.error?.message ?? `Request failed with status ${response.status}.`,
      };
    }

    const candidateParts = json.candidates?.[0]?.content?.parts ?? [];
    const imagePart = candidateParts.find((part) => part.inlineData?.data);

    if (!imagePart?.inlineData?.data) {
      return { success: false, error: 'No image was returned by Gemini.' };
    }

    return { success: true, imageBase64: imagePart.inlineData.data };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error generating image.',
    };
  }
}
