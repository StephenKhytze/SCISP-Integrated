const fs = require('fs');
const path = require('path');

function walkSync(dir, callback) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    var filepath = path.join(dir, file);
    const stats = fs.statSync(filepath);
    if (stats.isDirectory()) {
      walkSync(filepath, callback);
    } else if (stats.isFile() && (filepath.endsWith('.jsx') || filepath.endsWith('.js'))) {
      callback(filepath);
    }
  });
}

walkSync(path.join(__dirname, 'src'), (filepath) => {
  let content = fs.readFileSync(filepath, 'utf8');
  let original = content;

  // replace getItem('access_token')
  content = content.replace(/localStorage\.getItem\(['"]access_token['"]\)/g, "(localStorage.getItem('access_token') || sessionStorage.getItem('access_token'))");

  // replace getItem('user')
  content = content.replace(/localStorage\.getItem\(['"]user['"]\)/g, "(localStorage.getItem('user') || sessionStorage.getItem('user'))");

  // replace removeItem('access_token') and removeItem('user') globally (e.g. Layout.jsx, api.js)
  content = content.replace(/localStorage\.removeItem\(['"]access_token['"]\)/g, "localStorage.removeItem('access_token'); sessionStorage.removeItem('access_token')");
  content = content.replace(/localStorage\.removeItem\(['"]user['"]\)/g, "localStorage.removeItem('user'); sessionStorage.removeItem('user')");

  if (original !== content) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log('Updated', filepath);
  }
});
