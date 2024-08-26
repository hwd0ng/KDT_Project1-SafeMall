import axios from 'axios';
import cheerio from 'cheerio';

const snsPlatforms = {
  facebook: 'facebook.com',
  twitter: 'twitter.com',
  instagram: 'instagram.com',
  youtube: 'youtube.com',
  naverBlog: 'blog.naver.com'
};

// axios.defaults.headers.common['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

class SocialMediaScraper {
  constructor() {
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    };
    this.timeout = 2000;
  }

  async getSocialMediaUrls(url) {
    try {
      const response = await axios.get(`https://${url}`, {
        headers: this.headers,
        timeout: this.timeout
      });
      const html = response.data;
      const $ = cheerio.load(html);
      console.log('url:', url)
      let socialUrls = {};

      // Iterate over each SNS platform and extract matching links
      Object.entries(snsPlatforms).forEach(([platform, pattern]) => {
        $('a').each(function () {
          const href = $(this).attr('href');
          if (href && href.includes(pattern)) {
            if (!socialUrls[platform]) {
              socialUrls[platform] = [];
            }
            socialUrls[platform].push(href);
          }
        });
      });

      return socialUrls;
    } catch (error) {
      console.error('Error:', error);
      return {};
    }
  }
}

export default SocialMediaScraper;
