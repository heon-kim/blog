const fs = require('fs');
const path = require('path');
const matter = require('front-matter');

function generatePosts() {
  const postsDir = path.join(process.cwd(), 'public', 'posts');
  const posts = [];

  // 모든 카테고리와 서브카테고리를 순회
  const categories = fs.readdirSync(postsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.'));

  categories.forEach(category => {
    const categoryPath = path.join(postsDir, category.name);
    const subcategories = fs.readdirSync(categoryPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory());

    subcategories.forEach(subcategory => {
      const subcategoryPath = path.join(categoryPath, subcategory.name);
      const files = fs.readdirSync(subcategoryPath)
        .filter(file => file.endsWith('.md'));

      files.forEach(file => {
        const id = path.basename(file, '.md');
        posts.push({
          id,
          category: category.name,
          subcategory: subcategory.name,
        });
      });
    });
  });

  // posts.js 파일 생성
  const postsContent = `// 이 파일은 자동으로 생성되었습니다. 직접 수정하지 마세요.
export const posts = ${JSON.stringify(posts, null, 2)};`;

  fs.writeFileSync(
    path.join(process.cwd(), 'src', 'data', 'posts.js'),
    postsContent
  );

  console.log('Posts list generated successfully!');
}

generatePosts(); 