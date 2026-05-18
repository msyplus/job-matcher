import { useEffect, useState } from 'react';
import api from '../services/api';
import type { Application } from '../types';

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  applied: { label: '已投递', color: 'bg-blue-500' },
  viewed: { label: '被查看', color: 'bg-purple-500' },
  screening: { label: '初筛中', color: 'bg-amber-500' },
  interview: { label: '面试邀约', color: 'bg-green-500' },
  offer: { label: 'Offer', color: 'bg-emerald-500' },
  rejected: { label: '不合适', color: 'bg-red-400' },
  accepted: { label: '已入职', color: 'bg-green-600' },
};

const STATUSES = Object.keys(STATUS_MAP);

export default function Tracking() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    platform: '',
    jobTitle: '',
    company: '',
    resumeId: '',
    notes: '',
  });

  const loadApps = async () => {
    setLoading(true);
    const { data } = await api.get('/applications').catch(() => ({ data: [] }));
    setApps(data);
    setLoading(false);
  };

  useEffect(() => { loadApps(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/applications', form);
    setShowForm(false);
    setForm({ platform: '', jobTitle: '', company: '', resumeId: '', notes: '' });
    loadApps();
  };

  const handleStatusChange = async (id: string, status: string) => {
    await api.put(`/applications/${id}/status`, { status });
    loadApps();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">投递追踪</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          + 记录投递
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">新增投递记录</h3>
          <form onSubmit={handleCreate} className="grid md:grid-cols-2 gap-4">
            <input
              required
              placeholder="公司名称"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              required
              placeholder="职位名称"
              value={form.jobTitle}
              onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              required
              placeholder="投递平台（如 Boss直聘）"
              value={form.platform}
              onChange={(e) => setForm({ ...form, platform: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              placeholder="备注（可选）"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                保存
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                取消
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center text-gray-400 py-12">加载中...</div>
      ) : apps.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-4">📮</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">还没有投递记录</h3>
          <p className="text-gray-500">点击「+ 记录投递」手动记录你的每一次投递</p>
        </div>
      ) : (
        <div className="space-y-3">
          {apps.map((app) => {
            const status = STATUS_MAP[app.status] || STATUS_MAP.applied;
            return (
              <div key={app.id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">
                      {app.jobTitle}
                    </div>
                    <div className="text-sm text-gray-500 mt-0.5">
                      {app.company} · {app.platform} · {new Date(app.appliedAt).toLocaleDateString('zh-CN')}
                    </div>
                    {app.notes && <div className="text-xs text-gray-400 mt-2">{app.notes}</div>}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${status.color}`} />
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className="text-sm border border-gray-200 rounded-lg px-2 py-1 outline-none"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{STATUS_MAP[s].label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
