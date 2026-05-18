import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';

const navItems = [
  { path: '/', label: '首页看板', icon: '📊' },
  { path: '/experience', label: '经历库', icon: '📋' },
  { path: '/jd-match', label: 'JD 匹配', icon: '🎯' },
  { path: '/resume', label: '简历生成', icon: '📝' },
  { path: '/recommend', label: '岗位推荐', icon: '💼' },
  { path: '/tracking', label: '投递追踪', icon: '📮' },
  { path: '/feedback', label: '反馈', icon: '💬' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-bold text-lg text-indigo-600">
              JobMatcher
            </Link>
            <nav className="hidden md:flex gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                    (item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path))
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {item.icon} {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin" className="text-xs text-gray-400 hover:text-gray-600 hidden md:block">管理</Link>
            <span className="text-sm text-gray-600">{user?.name}</span>
            <button
              onClick={logout}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors"
            >
              退出
            </button>
          </div>
        </div>
        {/* Mobile nav */}
        <nav className="md:hidden flex overflow-x-auto px-4 pb-2 gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
                (item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path))
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="max-w-6xl mx-auto p-4">{children}</main>
    </div>
  );
}
