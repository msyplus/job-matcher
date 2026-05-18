// Popup logic
const API_BASE = 'https://job-matcher-vui2.onrender.com/api';
const app = document.getElementById('app');

function renderLoading(msg) {
  app.innerHTML = '<div class="status">' + msg + '</div>';
}

function renderError(msg) {
  app.innerHTML = '<div class="status error">' + msg + '</div>';
}

function renderJob(job, score) {
  const scoreClass = score >= 70 ? 'score-high' : score >= 40 ? 'score-mid' : 'score-low';
  const skills = job.matchedSkills || [];

  app.innerHTML = `
    <div class="title">${escapeHtml(job.title || '(未识别)')}</div>
    <div class="info">${escapeHtml(job.company || '')} · ${escapeHtml(job.location || '')}</div>
    <div class="info">${escapeHtml(job.salary || '')}</div>
    <div class="score ${scoreClass}">${score}% 匹配</div>
    ${skills.length > 0 ? '<div class="skills">' + skills.map(s => '<span class="skill">' + escapeHtml(s) + '</span>').join('') + '</div>' : ''}
    <button class="btn btn-primary" id="saveBtn">保存到我的推荐</button>
    <div id="saveStatus" style="text-align:center;margin-top:8px;font-size:12px;"></div>
  `;

  document.getElementById('saveBtn').addEventListener('click', async () => {
    const btn = document.getElementById('saveBtn');
    const status = document.getElementById('saveStatus');
    btn.disabled = true;
    btn.textContent = '保存中...';

    try {
      const { token } = await chrome.storage.local.get('token');
      if (!token) {
        status.innerHTML = '<span class="error">请先在 JobMatcher 网站登录</span>';
        btn.disabled = false;
        btn.textContent = '保存到我的推荐';
        return;
      }

      const res = await fetch(API_BASE + '/job-search/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ url: job.url, rawText: job.description, platform: job.platform, title: job.title, company: job.company, location: job.location, salary: job.salary }),
      });
      const data = await res.json();
      if (res.ok) {
        status.textContent = '已保存! 匹配度 ' + data.matchScore + '%';
      } else {
        status.innerHTML = '<span class="error">' + (data.message || '保存失败') + '</span>';
      }
    } catch (e) {
      status.innerHTML = '<span class="error">网络错误</span>';
    }
    btn.disabled = false;
    btn.textContent = '保存到我的推荐';
  });
}

function escapeHtml(s) {
  const div = document.createElement('div');
  div.textContent = s || '';
  return div.innerHTML;
}

// Main flow
(async () => {
  renderLoading('正在获取岗位数据...');

  // Get token from storage
  const { token } = await chrome.storage.local.get('token');

  // Get job data from content script
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.tabs.sendMessage(tab.id, { type: 'GET_JOB_DATA' }, async (response) => {
    if (!response || !response.platform) {
      renderError('未检测到招聘网站页面<br>请打开 Boss直聘/猎聘/51job/智联 的职位详情页');
      return;
    }

    if (!token) {
      app.innerHTML = `
        <div class="title">${escapeHtml(response.title || '岗位')}</div>
        <div class="info">${escapeHtml(response.company || '')}</div>
        <div class="info">${escapeHtml(response.location || '')} · ${escapeHtml(response.salary || '')}</div>
        <div class="status" style="margin-top:12px">请先在 JobMatcher 网站登录<br>登录后 token 自动同步</div>
        <a href="https://job-matcher-vui2.onrender.com/login" target="_blank" class="btn btn-primary" style="text-align:center;text-decoration:none;display:block;">去登录</a>
      `;
      return;
    }

    renderLoading('AI 分析中...');

    try {
      const res = await fetch(API_BASE + '/job-search/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({
          url: response.url,
          rawText: response.description,
          platform: response.platform,
          title: response.title,
          company: response.company,
          location: response.location,
          salary: response.salary,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        renderJob(data, data.matchScore || 0);
      } else {
        renderError(data.message || '请求失败');
      }
    } catch (e) {
      renderError('网络错误，请检查连接');
    }
  });
})();
