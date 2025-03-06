const { writeFileSync, readFileSync } = require('fs');
const { join } = require('path');
const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');
const frontMatter = require('front-matter');

async function generateSitemap() {
  // 동적 import 사용
  const { posts } = await import('../src/data/posts.js');
  
  const links = [
    // 메인 페이지
    { url: '/', changefreq: 'daily', priority: 1 },
    
    // 게시물 페이지들
    ...posts.map(post => {
      // 각 포스트의 마크다운 파일 경로
      const postPath = join(process.cwd(), 'public', 'posts', post.category, post.subcategory, `${post.id}.md`);
      
      // 마크다운 파일 읽기
      const fileContent = readFileSync(postPath, 'utf-8');
      
      // frontmatter로 메타데이터 파싱
      const { attributes } = frontMatter(fileContent);
      
      return {
        url: `/post/${post.id}`,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: attributes.createdAt // 포스트의 생성일
      };
    })
  ];

  const stream = new SitemapStream({ hostname: 'https://heonlog.netlify.app' });
  
  // sitemap XML 생성
  const sitemap = await streamToPromise(Readable.from(links).pipe(stream));
  
  // 파일로 저장
  writeFileSync('./sitemap.xml', sitemap.toString());
}

generateSitemap().catch(console.error); 