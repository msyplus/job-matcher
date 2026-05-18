import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { DashboardStats } from '../types';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/applications/stats')
      .then(({ data }) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: '总投递数', value: stats?.total || 0, color: 'bg-indigo-500' },
    { label: '被查看', value: stats?.viewed || 0, color: 'bg-blue-500' },
    { label: '面试邀约', value: stats?.interview || 0, color: 'bg-green-500' },
    { label: '面试率', value: stats?.interviewRate ? `${stats.interviewRate}%` : '0%', color: 'bg-amber-500' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">首页看板</h2>
        <button
          onClick={() => navigate('/jd-match')}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          + 新增投递
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl p-4 border border-gray-200">
            <div className={`w-2 h-2 rounded-full ${card.color} mb-2`} />
            <div className="text-2xl font-bold text-gray-800">
              {loading ? '-' : card.value}
            </div>
            <div className="text-sm text-gray-500">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">快速开始</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/experience')}
            className="p-4 border border-gray-200 rounded-lg text-left hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors"
          >
            <div className="text-2xl mb-2">📋</div>
            <div className="font-medium text-gray-800">1. 完善经历库</div>
            <div className="text-sm text-gray-500">添加教育、工作、技能信息</div>
          </button>
          <button
            onClick={() => navigate('/jd-match')}
            className="p-4 border border-gray-200 rounded-lg text-left hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors"
          >
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-medium text-gray-800">2. 粘贴 JD</div>
            <div className="text-sm text-gray-500">AI 解析岗位要求并匹配打分</div>
          </button>
          <button
            onClick={() => navigate('/resume')}
            className="p-4 border border-gray-200 rounded-lg text-left hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors"
          >
            <div className="text-2xl mb-2">📝</div>
            <div className="font-medium text-gray-800">3. 生成定制简历</div>
            <div className="text-sm text-gray-500">AI 按 JD 量身打造简历</div>
          </button>
        </div>
      </div>
    </div>
  );
}
