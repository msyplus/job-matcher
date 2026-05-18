import * as cheerio from 'cheerio';

export interface JobListing {
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  sourceUrl: string;
  sourcePlatform: string;
}

export async function searchBoss(keyword: string, location?: string, limit = 20): Promise<JobListing[]> {
  const query = encodeURIComponent(keyword);
  const locCode = location ? `&city=${encodeURIComponent(location)}` : '';
  const url = `https://www.zhipin.com/web/geek/job?query=${query}${locCode}`;

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml',
    'Accept-Language': 'zh-CN,zh;q=0.9',
  };

  const response = await fetch(url, { headers, signal: AbortSignal.timeout(15000) });
  const html = await response.text();
  const $ = cheerio.load(html);

  const jobs: JobListing[] = [];
  $('.job-card-wrapper').each((_, el) => {
    if (jobs.length >= limit) return;

    const $el = $(el);
    const title = $el.find('.job-name').text().trim();
    const company = $el.find('.company-name').text().trim();
    const locationText = $el.find('.job-area').text().trim();
    const salaryText = $el.find('.salary').text().trim();
    const descItems = $el.find('.job-info .tag-list li').map((_, li) => $(li).text().trim()).get();
    const link = $el.find('.job-card-left a').attr('href') || '';

    if (title && company) {
      jobs.push({
        title,
        company,
        location: locationText,
        salary: salaryText,
        description: descItems.join(' | '),
        sourceUrl: link.startsWith('http') ? link : `https://www.zhipin.com${link}`,
        sourcePlatform: 'boss',
      });
    }
  });

  return jobs;
}
