import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import type { GeneratedResume } from '../types';

export default function ResumeEditor() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const jdId = searchParams.get('jdId');

  const [resume, setResume] = useState<GeneratedResume | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (id && id !== 'new') {
      api.get(`/resume/${id}`).then(({ data }) => setResume(data)).catch(() => {});
    }
  }, [id]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const { data } = await api.post('/resume/generate', { jdId });
      setResume(data);
    } catch (err) {
      console.error('Generate failed', err);
    } finally {
      setGenerating(false);
    }
  };

  const toggleLock = (index: number) => {
    if (!resume) return;
    const sections = [...(resume.content.sections || [])];
    sections[index] = { ...sections[index], locked: !sections[index].locked };
    setResume({ ...resume, content: { ...resume.content, sections } });
  };

  const updateBody = (index: number, body: string) => {
    if (!resume) return;
    const sections = [...(resume.content.sections || [])];
    sections[index] = { ...sections[index], body };
    setResume({ ...resume, content: { ...resume.content, sections } });
  };

  const handleSave = async () => {
    if (!resume) return;
    await api.put(`/resume/${resume.id}`, { content: resume.content });
  };

  const handleExportPDF = () => {
    if (!resume) return;
    window.open(`/api/resume/export/${resume.id}`, '_blank');
  };

  if (!resume) {
    return (
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-6">简历生成</h2>
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">AI 定制简历</h3>
          <p className="text-gray-500 mb-6">
            先在「JD 匹配」页面解析一个 JD，然后基于该 JD 生成量身定制的简历。
          </p>
          {jdId ? (
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {generating ? '🪄 AI 生成中...' : '🪄 开始 AI 生成简历'}
            </button>
          ) : (
            <p className="text-sm text-gray-400">请从「JD 匹配」页面跳转过来，或选择一个已有简历</p>
          )}
        </div>
      </div>
    );
  }

  const sections = resume.content.sections || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          简历编辑器
          {resume.content.matchScore && (
            <span className="ml-3 text-sm font-normal text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              JD 匹配度 {resume.content.matchScore}%
            </span>
          )}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            保存
          </button>
          <button
            onClick={handleExportPDF}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            导出 PDF
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((section, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">{section.title}</h3>
              <button
                onClick={() => toggleLock(index)}
                className={`text-xs px-2 py-1 rounded-full transition-colors ${
                  section.locked
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-gray-50 text-gray-400 border border-gray-200'
                }`}
              >
                {section.locked ? '🔒 已锁定' : '🔓 可编辑'}
              </button>
            </div>
            <textarea
              value={section.body}
              onChange={(e) => updateBody(index, e.target.value)}
              disabled={section.locked}
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-y text-sm disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
