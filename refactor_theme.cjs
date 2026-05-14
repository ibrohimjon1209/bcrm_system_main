const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      filelist.push(dirFile);
    }
  });
  return filelist;
};

const files = walkSync('./src').filter(file => file.endsWith('.jsx'));

const colors = ['red', 'green', 'emerald', 'yellow', 'amber', 'orange', 'rose', 'sky', 'violet', 'indigo'];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const initialContent = content;

  // For each color, we replace its classes with blue
  // Example: text-red-500 -> text-blue-500
  // bg-emerald-50 -> bg-blue-50
  
  colors.forEach(color => {
    const regex = new RegExp(`-${color}-`, 'g');
    content = content.replace(regex, '-blue-');
  });

  // some specific replacements if they exist
  // sometimes text-red-500, we handled it with the regex above (e.g. text-red-500 becomes text-blue-500)

  if (initialContent !== content) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Refactored everything to blue in: ${file}`);
  }
});
