import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Admin() {
  const [tab, setTab] = useState<'stats' | 'feedbacks' | 'users'>('stats');
  const [stats, setStats] = useState<any>(null);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (tab === 'stats') {
      api.get('/admin/stats').then(r => setStats(r.data)).finally(() => setLoading(false));
    } else if (tab === 'feedbacks') {
      api.get('/admin/feedbacks?limit=100').then(r => setFeedbacks(r.data.items)).finally(() => setLoading(false));
    } else if (tab === 'users') {
      api.get('/admin/users?limit=100').then(r => setUsers(r.data.items)).finally(() => setLoading(false));
    }
  }, [tab]);

  const updateFeedbackStatus = async (id: string, status: string) => {
    await api.put(`/feedbacks/${id}`, { status });
    const { data } = await api.get('/admin/feedbacks?limit=100');
    setFeedbacks(data.items);
  };

  const STATUS_MAP: Record<string, string> = { pending: '待处理', processing: '处理中', resolved: '已解决', closed: '已关闭' };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">管理后台</h2>
      <div className="flex gap-1 mb-6 bg-white rounded-lg p-1 border border-gray-200">
        {(['stats','feedbacks','users'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-md text-sm font-medium ${tab===t?'bg-indigo-600 text-white':'text-gray-600 hover:bg-gray-100'}`}>
            {t==='stats'?'数据概览':t==='feedbacks'?'反馈管理':'用户列表'}
          </button>
        ))}
      </div>

      {loading ? <div className="text-center py-12 text-gray-400">加载中...</div> : (
        <>
          {tab === 'stats' && stats && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <StatCard label="用户数" value={stats.users} />
              <StatCard label="简历数" value={stats.resumes} />
              <StatCard label="投递数" value={stats.applications} />
              <StatCard label="JD数" value={stats.jds} />
              <StatCard label="待处理反馈" value={stats.feedbacks?.pending} color="amber" />
            </div>
          )}

          {tab === 'feedbacks' && (
            <div className="space-y-3">
              {feedbacks.map((fb: any) => (
                <div key={fb.id} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${fb.type==='bug'?'bg-red-50 text-red-600':fb.type==='feature'?'bg-blue-50 text-blue-600':fb.type==='experience'?'bg-amber-50 text-amber-600':'bg-gray-100 text-gray-600'}`}>
                          {fb.type==='bug'?'Bug':fb.type==='feature'?'建议':fb.type==='experience'?'体验':'其他'}
                        </span>
                        <span className="text-xs text-gray-400">{new Date(fb.createdAt).toLocaleString('zh-CN')}</span>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{fb.content}</p>
                      {fb.contact && <div className="text-xs text-gray-400 mt-1">联系方式: {fb.contact}</div>}
                    </div>
                    <select value={fb.status} onChange={e=>updateFeedbackStatus(fb.id, e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1 ml-3 outline-none">
                      {Object.entries(STATUS_MAP).map(([k,v])=><option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>
                </div>
              ))}
              {feedbacks.length===0 && <div className="text-center py-8 text-gray-400">暂无反馈</div>}
            </div>
          )}

          {tab === 'users' && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50 text-left text-gray-500">
                  <th className="px-4 py-3 font-medium">邮箱</th><th className="px-4 py-3 font-medium">姓名</th>
                  <th className="px-4 py-3 font-medium">城市</th><th className="px-4 py-3 font-medium">状态</th>
                  <th className="px-4 py-3 font-medium">注册时间</th>
                </tr></thead>
                <tbody>
                  {users.map((u: any) => (
                    <tr key={u.id} className="border-t border-gray-100">
                      <td className="px-4 py-3">{u.email}</td><td className="px-4 py-3">{u.name||'-'}</td>
                      <td className="px-4 py-3 text-gray-500">{u.city||'-'}</td><td className="px-4 py-3">{u.jobStatus}</td>
                      <td className="px-4 py-3 text-gray-400">{new Date(u.createdAt).toLocaleDateString('zh-CN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, color='indigo' }: { label: string; value: number; color?: string }) {
  const colors: Record<string,string> = { indigo:'bg-indigo-500', amber:'bg-amber-500', green:'bg-green-500' };
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      <div className={`w-2 h-2 rounded-full ${colors[color]||colors.indigo} mb-2`} />
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}
