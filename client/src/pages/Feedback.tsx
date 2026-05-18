import { useState } from 'react';
import api from '../services/api';

const TYPES = [
  { value: 'bug', label: 'Bug 报告' },
  { value: 'feature', label: '功能建议' },
  { value: 'experience', label: '体验问题' },
  { value: 'other', label: '其他' },
];

export default function Feedback() {
  const [type, setType] = useState('feature');
  const [content, setContent] = useState('');
  const [contact, setContact] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSending(true); setError('');
    try {
      await api.post('/feedbacks', { type, content: content.trim(), contact: contact.trim() || undefined });
      setSubmitted(true);
    } catch (err: any) {
      setError('提交失败，请重试');
    }
    setSending(false);
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-4">📨</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">感谢反馈!</h3>
          <p className="text-gray-500 mb-6">我们会尽快处理你的反馈</p>
          <button onClick={() => { setSubmitted(false); setContent(''); }} className="text-indigo-600 hover:underline text-sm">继续提交</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-6">反馈建议</h2>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">反馈类型</label>
            <div className="flex flex-wrap gap-2">
              {TYPES.map(t => (
                <button key={t.value} type="button" onClick={() => setType(t.value)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${type === t.value ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">详细描述</label>
            <textarea required value={content} onChange={e => setContent(e.target.value)} rows={5}
              placeholder="请描述你遇到的问题或建议..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-y" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">联系方式（选填）</label>
            <input value={contact} onChange={e => setContact(e.target.value)} placeholder="邮箱或微信号，方便我们回复"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button type="submit" disabled={sending || !content.trim()}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">
            {sending ? '提交中...' : '提交反馈'}
          </button>
        </form>
      </div>
    </div>
  );
}
