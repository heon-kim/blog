const fs = require('fs');
const path = require('path');

// 카테고리 이름 매핑 (영어 -> 한글)
const categoryNameMap = {
  'Frontend': '프론트엔드',
  'Backend': '백엔드',
  'DevOps': '데브옵스',
  'JavaScript': '자바스크립트',
  'CSS': 'CSS',
  'React': '리액트',
  'Node.js': '노드',
  'Database': '데이터베이스',
  'Docker': '도커',
  'AWS': 'AWS',
  'Review': '회고',
  'Service': '서비스'
};

function generateCategories() {
  const postsDir = path.join(process.cwd(), 'public', 'posts');
  const categories = {};

  // 메인 카테고리 폴더들을 읽음
  const mainCategories = fs.readdirSync(postsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.'));

  mainCategories.forEach(mainCat => {
    const mainCatPath = path.join(postsDir, mainCat.name);
    const subcategories = {};

    // 서브카테고리 폴더들을 읽음
    const subCategories = fs.readdirSync(mainCatPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory());

    subCategories.forEach(subCat => {
      subcategories[subCat.name] = {
        name: categoryNameMap[subCat.name] || subCat.name
      };
    });

    categories[mainCat.name] = {
      name: categoryNameMap[mainCat.name] || mainCat.name,
      subcategories
    };
  });

  // categories.js 파일 생성
  const categoriesContent = `// 이 파일은 자동으로 생성되었습니다. 직접 수정하지 마세요.
export const CATEGORIES = ${JSON.stringify(categories, null, 2)};`;

  fs.writeFileSync(
    path.join(process.cwd(), 'src', 'data', 'categories.js'),
    categoriesContent
  );

  console.log('Categories generated successfully!');
}

generateCategories(); 