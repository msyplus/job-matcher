// Content script: Extract JD from current page
(function () {
  const url = window.location.href;
  let platform = '';
  let jobData = { title: '', company: '', location: '', salary: '', description: '' };

  if (url.includes('zhipin.com')) {
    platform = 'boss';
    jobData.title = (document.querySelector('.job-name') || document.querySelector('.name'))?.textContent?.trim() || '';
    jobData.company = (document.querySelector('.company-name') || document.querySelector('.company-info .name'))?.textContent?.trim() || '';
    jobData.salary = document.querySelector('.salary')?.textContent?.trim() || '';
    jobData.location = document.querySelector('.job-area')?.textContent?.trim() || '';

    // Get JD details
    const descEl = document.querySelector('.job-detail') || document.querySelector('.job-sec') || document.querySelector('.detail-content');
    if (descEl) {
      jobData.description = descEl.textContent.trim();
    }
  } else if (url.includes('liepin.com')) {
    platform = 'liepin';
    jobData.title = document.querySelector('.job-title')?.textContent?.trim() || document.querySelector('h1')?.textContent?.trim() || '';
    jobData.company = document.querySelector('.company-name')?.textContent?.trim() || '';
    jobData.salary = document.querySelector('.job-salary')?.textContent?.trim() || '';
    jobData.location = document.querySelector('.job-area')?.textContent?.trim() || '';

    // Get JD details
    const descEl = document.querySelector('.job-description') || document.querySelector('.content-word');
    if (descEl) {
      jobData.description = descEl.textContent.trim();
    }
  } else if (url.includes('51job.com')) {
    platform = '51job';
    jobData.title = document.querySelector('.jname')?.textContent?.trim() || document.querySelector('h1')?.textContent?.trim() || '';
    jobData.company = document.querySelector('.cname')?.textContent?.trim() || '';
    jobData.salary = document.querySelector('.sal')?.textContent?.trim() || '';
    jobData.location = document.querySelector('.lname')?.textContent?.trim() || '';
    const descEl = document.querySelector('.job_msg') || document.querySelector('.bmsg');
    if (descEl) {
      jobData.description = descEl.textContent.trim();
    }
  } else if (url.includes('zhaopin.com')) {
    platform = 'zhaopin';
    jobData.title = document.querySelector('.job-name')?.textContent?.trim() || document.querySelector('h1')?.textContent?.trim() || '';
    jobData.company = document.querySelector('.company-name')?.textContent?.trim() || '';
    jobData.salary = document.querySelector('.job-salary')?.textContent?.trim() || '';
    jobData.location = document.querySelector('.job-city')?.textContent?.trim() || '';
    const descEl = document.querySelector('.job-description') || document.querySelector('.responsibility');
    if (descEl) {
      jobData.description = descEl.textContent.trim();
    }
  }

  // Listen for popup requests
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'GET_JOB_DATA') {
      sendResponse({ ...jobData, platform, url });
    }
  });

  // Store in session for popup to read
  if (platform) {
    chrome.runtime.sendMessage({
      type: 'JOB_DATA',
      data: { ...jobData, platform, url },
    });
  }
})();
