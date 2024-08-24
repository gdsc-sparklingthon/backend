import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class GptService {
  constructor(private readonly openai: OpenAI) {
    this.openai = new OpenAI({
      organization: 'org-2hBClm68lIMWeMQq40Iyn9Va',
      apiKey: process.env.GPT_API_KEY,
    });
  }

  async getFirstResponse(name: string) {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              '당신은 5세에서 9세 사이의 아이들을 돕는 친근하고 공감적인 음성 어시스턴트입니다. 다음 친구 이름을 반갑게 환영해주세요: ' +
              name.substring(1),
          },
        ],
        temperature: 0.7,
        max_tokens: 60,
      });
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating sentence:', error);
      return null;
    }
  }

  async getPoint(question: string, answer: string) {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              '질문: ' +
              question +
              ', 답변: ' +
              answer +
              ' 입니다. 대답을 듣고 숫자가 커질수록 우울함의 정도를 평가할때, 0, 1, 2 중 하나의 점수를 반환해줘.',
          },
        ],
        temperature: 0.7,
        max_tokens: 60,
      });
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating sentence:', error);
      return null;
    }
  }

  async getResponse(answer: string) {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              '당신은 5세에서 9세 사이의 아이들을 돕는 친근하고 공감적인 음성 어시스턴트입니다. 아이가' +
              answer +
              ' 라고 대답했어요. 아이들이 쉽게 이해하고 친근하게 느낄 수 있도록 공감하세요.',
          },
        ],
        temperature: 0.7,
        max_tokens: 60,
      });
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating sentence:', error);
      return null;
    }
  }
}
