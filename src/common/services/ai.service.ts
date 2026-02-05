import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AiService {
    private readonly API_URL =
        'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent';


    async askWithProducts(userPrompt: string, products: any[]) {
        const prompt = `
    المنتجات الموجودة في المتجر:
    ${JSON.stringify(products.slice(0, 10), null, 2)}

    سؤال المستخدم:
    "${userPrompt}"

    استخدم المنتجات دي و اعمل سيرش عنها للرد على المستخدم بالعربي،
    ولو الحاجة مش موجودة ضمن المنتجات، قول إنك مش لاقيها.
    `;

        try {
            const response = await axios.post(
                `${this.API_URL}?key=${process.env.GEMINI_API_KEY}`,
                {
                    contents: [
                        {
                            parts: [{ text: prompt }],
                        },
                    ],
                },
            );

            return (
                response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
                'مافيش رد متاح دلوقتي 😅'
            );
        } catch (err: any) {
            console.error('Gemini API Error:', err.response?.data || err.message);
            return 'حصل خطأ أثناء التواصل مع نموذج Gemini.';
        }
    }
}
