import { useState } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL;

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function Chatbot( ) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'مرحبًا، أنا مساعد متجر التقنية. كيف أساعدك؟',
    },
  ]);
  const [loading, setLoading] = useState(false);

  async function sendMessage(event: React.FormEvent) {
    event.preventDefault();
    const text = message.trim();
    if (!text || loading) return;

    setMessages((old) => [...old, { role: 'user', content: text }]);
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/chatbot/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'تعذر الاتصال بالمساعد');
      setMessages((old) => [...old, { role: 'assistant', content: data.answer }]);
    } catch (error) {
      const text = error instanceof Error ? error.message : 'حدث خطأ غير متوقع';
      setMessages((old) => [...old, { role: 'assistant', content: text }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="box" id="chatbot">
      <h2>مساعد متجر التقنية</h2>
      <div style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
        {messages.map((item, index) => (
          <div key={`${item.role}-${index}`} style={{ padding: 10 }}>
            <strong>{item.role === 'user' ? 'أنت' : 'المساعد'}: </strong>
            {item.content}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} style={{ display: 'flex', gap: 8 }}>
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="اكتب سؤالك..."
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'جارٍ التفكير...' : 'إرسال'}
        </button>
      </form>
    </section>
  );
}