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
              '다음 아이 이름을 반갑게 인사해주세요: ' + name.substring(1),
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

  async getAnswer() {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              '당신은 5세에서 9세 사이의 아이들을 돕는 친근하고 공감적인 음성 어시스턴트입니다. 아이들이 쉽게 이해하고 친근하게 느낄 수 있도록 소통하세요.',
          },
          {
            role: 'user',
            content: `다음 문장을 5세에서 10세 사이의 아이가 이해하기 쉽고 친근한 표현으로 바꾼 내용만 알려주세요: '당신은 몇살까지 살까요'`,
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
              ' 입니다. 숫자가 커지를 수록 우울하다고 할 때 답변의 우을함의 정도를 0, 1, 2로 평가하고 점수만 알려주세요.',
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
