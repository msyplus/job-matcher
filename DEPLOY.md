# JobMatcher 部署指南

## 方式一：Docker 部署（推荐，适合任意云平台）

### 本地测试
```bash
# 设置 API Key
export DEEPSEEK_API_KEY=sk-xxx

# 构建并启动
docker compose up -d --build

# 打开 http://localhost:3000
```

### 部署到云平台

#### A. Railway (railway.app)
```bash
# 1. 安装 Railway CLI
npm i -g @railway/cli

# 2. 登录并部署
railway login
railway init
railway up

# 3. 设置环境变量
railway variables set DEEPSEEK_API_KEY=sk-xxx
railway variables set JWT_SECRET=your-random-secret
```

#### B. Render (render.com)
1. 将代码推送到 GitHub
2. 在 Render 创建 **Web Service**
3. 选择 Docker 运行时
4. 设置环境变量：
   - `DEEPSEEK_API_KEY` = 你的 API key
   - `JWT_SECRET` = 随机字符串
5. 点击部署

#### C. Fly.io
```bash
# 1. 安装 flyctl
# 2. 部署
fly launch
fly secrets set DEEPSEEK_API_KEY=sk-xxx
fly deploy
```

---

## 方式二：VPS 直接部署

### 要求
- Node.js 24+
- git

### 步骤
```bash
# 1. 克隆代码
git clone <your-repo-url> job-matcher
cd job-matcher

# 2. 安装依赖并构建
npm install
npm run build

# 3. 配置环境变量
cp server/.env.example server/.env
# 编辑 server/.env，填入 DEEPSEEK_API_KEY 和 JWT_SECRET

# 4. 用 PM2 启动
npm install -g pm2
pm2 start server/dist/main.prod.js --name job-matcher
pm2 save
pm2 startup
```

### Nginx 反向代理（可选）
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 环境变量说明

| 变量 | 必填 | 说明 |
|------|------|------|
| `DEEPSEEK_API_KEY` | 是 | DeepSeek API 密钥 |
| `JWT_SECRET` | 推荐 | JWT 签名密钥（生产环境务必修改） |
| `DEEPSEEK_BASE_URL` | 否 | API 端点（默认 https://api.deepseek.com/v1） |
| `DEEPSEEK_MODEL` | 否 | 模型名称（默认 deepseek-v4-pro） |
| `PORT` | 否 | 服务端口（默认 3000） |
| `DB_PATH` | 否 | SQLite 数据库路径 |

---

## 管理员账号

部署后首次访问，用以下账号登录即为管理员：
- 邮箱：`admin@jobmatcher.com`
- 密码：`admin123`

> 生产环境建议登录后修改密码。
