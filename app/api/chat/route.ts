import { NextRequest, NextResponse } from 'next/server';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ReplicateRequest {
  input: {
    tools: any[];
    top_k: number;
    top_p: number;
    prompt: string;
    stream: boolean;
    messages: any[];
    documents: any[];
    max_tokens: number;
    min_tokens: number;
    temperature: number;
    presence_penalty: number;
    frequency_penalty: number;
    chat_template_kwargs: object;
    add_generation_prompt: boolean;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Get the latest user message
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'user') {
      return NextResponse.json(
        { error: 'Last message must be from user' },
        { status: 400 }
      );
    }

    // Prepare the request payload for Replicate API
    const replicatePayload: ReplicateRequest = {
      input: {
        tools: [],
        top_k: 50,
        top_p: 0.9,
        prompt: lastMessage.content,
        stream: false,
        messages: messages.map((msg: ChatMessage) => ({
          role: msg.role,
          content: msg.content
        })),
        documents: [],
        max_tokens: 512,
        min_tokens: 0,
        temperature: 0.6,
        presence_penalty: 0,
        frequency_penalty: 0,
        chat_template_kwargs: {},
        add_generation_prompt: true
      }
    };

    // Make request to Replicate API
    const response = await fetch('https://api.replicate.com/v1/models/ibm-granite/granite-3.3-8b-instruct/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait'
      },
      body: JSON.stringify(replicatePayload)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Replicate API Error:', errorData);
      return NextResponse.json(
        { error: `Replicate API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Extract the response text from Replicate's response format
    let aiResponse = '';
    if (data.output && Array.isArray(data.output)) {
      aiResponse = data.output.join('');
    } else if (data.output && typeof data.output === 'string') {
      aiResponse = data.output;
    } else {
      console.error('Unexpected response format:', data);
      aiResponse = 'Sorry, I received an unexpected response format.';
    }

    return NextResponse.json({
      message: aiResponse.trim() || 'I apologize, but I couldn\'t generate a response. Please try again.'
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}