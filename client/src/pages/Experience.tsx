import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import Modal from '../components/common/Modal';
import type { Education, WorkExperience, Skill, Certificate } from '../types';

type Tab = 'education' | 'work' | 'skills' | 'certificates';

const emptyEdu: Partial<Education> = { school: '', major: '', degree: '本科', startDate: '', endDate: '' };
const emptyWork: Partial<WorkExperience> = { company: '', position: '', startDate: '', endDate: '', description: '' };
const emptySkill: Partial<Skill> = { name: '', proficiency: 3, years: 0 };
const emptyCert: Partial<Certificate> = { name: '', issuer: '', date: '' };

export default function Experience() {
  const [activeTab, setActiveTab] = useState<Tab>('education');
  const [educations, setEducations] = useState<Education[]>([]);
  const [works, setWorks] = useState<WorkExperience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; edit?: any }>({ open: false });
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const [edu, work, skill, cert] = await Promise.all([
      api.get('/experiences/educations').then(r => r.data).catch(() => []),
      api.get('/experiences/work').then(r => r.data).catch(() => []),
      api.get('/experiences/skills').then(r => r.data).catch(() => []),
      api.get('/experiences/certificates').then(r => r.data).catch(() => []),
    ]);
    setEducations(edu); setWorks(work); setSkills(skill); setCertificates(cert);
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const openModal = (tab: Tab, edit?: any) => {
    if (edit) { setForm({ ...edit }); setModal({ open: true, edit }); }
    else {
      const empty = tab === 'education' ? emptyEdu : tab === 'work' ? emptyWork : tab === 'skills' ? emptySkill : emptyCert;
      setForm({ ...empty }); setModal({ open: true });
    }
  };

  const save = async () => {
    setSaving(true);
    const tab = activeTab;
    const id = modal.edit?.id;
    let url = '';
    let method = 'post';
    if (tab === 'education') { url = '/experiences/educations'; if (id) { url += '/' + id; method = 'put'; } }
    else if (tab === 'work') { url = '/experiences/work'; if (id) { url += '/' + id; method = 'put'; } }
    else if (tab === 'skills') { url = '/experiences/skills'; if (id) { url += '/' + id; method = 'put'; } }
    else if (tab === 'certificates') { url = '/experiences/certificates'; if (id) { url += '/' + id; method = 'put'; } }

    await (method === 'put' ? api.put(url, form) : api.post(url, form));
    setSaving(false); setModal({ open: false }); loadAll();
  };

  const remove = async (tab: Tab, id: string) => {
    if (!confirm('确认删除？')) return;
    const prefix = tab === 'education' ? '/experiences/educations/' : tab === 'work' ? '/experiences/work/' : tab === 'skills' ? '/experiences/skills/' : '/experiences/certificates/';
    await api.delete(prefix + id);
    loadAll();
  };

  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<string[] | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadResult(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const { data } = await api.post('/experiences/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadResult(data.saved || []);
      loadAll();
    } catch (err: any) {
      setUploadResult(['解析失败: ' + (err.response?.data?.message || '请重试')]);
    }
    setUploading(false);
    e.target.value = '';
  };

  const complete = Math.min(100, (educations.length * 20) + (works.length * 25) + (skills.length * 10) + (certificates.length * 5));
  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'education', label: '教育经历', count: educations.length },
    { key: 'work', label: '工作经历', count: works.length },
    { key: 'skills', label: '技能', count: skills.length },
    { key: 'certificates', label: '证书', count: certificates.length },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">个人经历库</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">完整度 {complete}%</span>
          <button onClick={() => openModal(activeTab)} className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700">+ 添加</button>
        </div>
      </div>

      {/* Resume Upload */}
      <div className="bg-white rounded-xl border border-dashed border-indigo-300 p-6 mb-6 text-center">
        <div className="text-3xl mb-2">📄</div>
        <h3 className="font-semibold text-gray-800 mb-1">上传简历自动解析</h3>
        <p className="text-sm text-gray-500 mb-4">支持 PDF / Word，AI 自动提取教育、工作、技能信息</p>
        <label className={`inline-block px-6 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-colors ${uploading ? 'bg-gray-300 text-gray-500' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
          {uploading ? 'AI 解析中...' : '上传简历文件'}
          <input type="file" accept=".pdf,.doc,.docx" onChange={handleUpload} disabled={uploading} className="hidden" />
        </label>
        {uploadResult && (
          <div className="mt-4 text-left max-w-md mx-auto">
            <div className="text-xs font-medium text-gray-600 mb-2">解析结果：</div>
            {uploadResult.map((r, i) => (
              <div key={i} className={`text-xs py-1 px-3 rounded mb-1 ${r.includes('失败') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>{r}</div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-1 mb-6 bg-white rounded-lg p-1 border border-gray-200">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.key ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {loading ? <div className="text-center text-gray-400 py-12">加载中...</div> : (
        <div className="space-y-3">
          {activeTab === 'education' && educations.map(e => (
            <div key={e.id} className="bg-white rounded-lg border border-gray-200 p-4 flex justify-between items-start">
              <div>
                <div className="font-medium text-gray-800">{e.school}</div>
                <div className="text-sm text-gray-500">{e.major} · {e.degree} · {e.startDate} - {e.endDate}</div>
              </div>
              <div className="flex gap-1 ml-2">
                <button onClick={() => openModal('education', e)} className="text-xs text-indigo-600 hover:underline">编辑</button>
                <button onClick={() => remove('education', e.id)} className="text-xs text-red-400 hover:underline ml-2">删除</button>
              </div>
            </div>
          ))}
          {activeTab === 'work' && works.map(w => (
            <div key={w.id} className="bg-white rounded-lg border border-gray-200 p-4 flex justify-between items-start">
              <div className="flex-1">
                <div className="font-medium text-gray-800">{w.position} @ {w.company}</div>
                <div className="text-sm text-gray-500">{w.startDate} - {w.endDate || '至今'}</div>
                {w.description && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{w.description}</p>}
              </div>
              <div className="flex gap-1 ml-2">
                <button onClick={() => openModal('work', w)} className="text-xs text-indigo-600 hover:underline">编辑</button>
                <button onClick={() => remove('work', w.id)} className="text-xs text-red-400 hover:underline ml-2">删除</button>
              </div>
            </div>
          ))}
          {activeTab === 'skills' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {skills.map(s => (
                <div key={s.id} className="bg-white rounded-lg border border-gray-200 p-3 relative group">
                  <div className="font-medium text-gray-800 text-sm">{s.name}</div>
                  <div className="flex gap-1 mt-2">{Array.from({length:5}).map((_,i)=>(<div key={i} className={`h-1.5 w-4 rounded-full ${i<s.proficiency?'bg-indigo-500':'bg-gray-200'}`}/>))}</div>
                  <div className="text-xs text-gray-400 mt-1">{s.years}年</div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button onClick={() => openModal('skills', s)} className="text-xs bg-white px-1.5 py-0.5 rounded shadow-sm text-indigo-600">编辑</button>
                    <button onClick={() => remove('skills', s.id)} className="text-xs bg-white px-1.5 py-0.5 rounded shadow-sm text-red-400">删除</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'certificates' && certificates.map(c => (
            <div key={c.id} className="bg-white rounded-lg border border-gray-200 p-4 flex justify-between items-start">
              <div>
                <div className="font-medium text-gray-800">{c.name}</div>
                <div className="text-sm text-gray-500">{c.issuer} · {c.date}</div>
              </div>
              <div className="flex gap-1 ml-2">
                <button onClick={() => openModal('certificates', c)} className="text-xs text-indigo-600 hover:underline">编辑</button>
                <button onClick={() => remove('certificates', c.id)} className="text-xs text-red-400 hover:underline ml-2">删除</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modal.open} onClose={() => setModal({ open: false })} title={`${modal.edit ? '编辑' : '添加'}${tabs.find(t=>t.key===activeTab)?.label}`}>
        <div className="space-y-4">
          {activeTab === 'education' && (<>
            <Field label="学校" value={form.school} onChange={v=>setForm({...form,school:v})} />
            <Field label="专业" value={form.major} onChange={v=>setForm({...form,major:v})} />
            <Field label="学历" value={form.degree} onChange={v=>setForm({...form,degree:v})} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="开始日期" value={form.startDate} onChange={v=>setForm({...form,startDate:v})} placeholder="2020-09" />
              <Field label="结束日期" value={form.endDate} onChange={v=>setForm({...form,endDate:v})} placeholder="2024-06" />
            </div>
          </>)}
          {activeTab === 'work' && (<>
            <Field label="公司" value={form.company} onChange={v=>setForm({...form,company:v})} />
            <Field label="职位" value={form.position} onChange={v=>setForm({...form,position:v})} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="开始日期" value={form.startDate} onChange={v=>setForm({...form,startDate:v})} />
              <Field label="结束日期" value={form.endDate} onChange={v=>setForm({...form,endDate:v})} placeholder="留空表示至今" />
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">工作描述</label>
              <textarea value={form.description||''} onChange={e=>setForm({...form,description:e.target.value})} rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-y" /></div>
          </>)}
          {activeTab === 'skills' && (<>
            <Field label="技能名称" value={form.name} onChange={v=>setForm({...form,name:v})} />
            <div><label className="block text-sm font-medium text-gray-700 mb-1">熟练度</label>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(i=>(<button key={i} type="button" onClick={()=>setForm({...form,proficiency:i})}
                  className={`w-8 h-8 rounded text-sm ${i<=form.proficiency?'bg-indigo-600 text-white':'bg-gray-100 text-gray-400'}`}>{i}</button>))}
              </div></div>
            <Field label="使用年限" value={String(form.years||0)} onChange={v=>setForm({...form,years:Number(v)})} type="number" />
          </>)}
          {activeTab === 'certificates' && (<>
            <Field label="证书名称" value={form.name} onChange={v=>setForm({...form,name:v})} />
            <Field label="颁发机构" value={form.issuer} onChange={v=>setForm({...form,issuer:v})} />
            <Field label="获取日期" value={form.date} onChange={v=>setForm({...form,date:v})} placeholder="2024-01" />
          </>)}
          <div className="flex gap-2 pt-2">
            <button onClick={save} disabled={saving} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50">{saving?'保存中...':'保存'}</button>
            <button onClick={()=>setModal({open:false})} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">取消</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
    </div>
  );
}
