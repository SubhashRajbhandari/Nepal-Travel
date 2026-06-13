const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== 'generated') {
        filelist = walkSync(dirFile, filelist);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      filelist.push(dirFile);
    }
  }
  return filelist;
};

const files = walkSync('.');
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  if (content.includes('from "@/lib/generated/prisma/client"')) {
    const regex = /import\s+\{([^}]+)\}\s+from\s+"@\/lib\/generated\/prisma\/client";/g;
    content = content.replace(regex, (match, p1) => {
      let imports = p1.split(',').map(s => s.trim()).filter(Boolean);
      let prismaImports = [];
      let typeImports = [];
      
      const enums = ['Difficulty', 'ReviewStatus', 'UserStatus', 'SuggestionStatus'];
      
      for (const imp of imports) {
        if (enums.includes(imp)) {
          typeImports.push(imp);
        } else {
          prismaImports.push(imp);
        }
      }
      
      let res = '';
      if (prismaImports.length > 0) {
        res += `import { ${prismaImports.join(', ')} } from "@/lib/generated/prisma/client";\n`;
      }
      if (typeImports.length > 0) {
        res += `import { ${typeImports.join(', ')} } from "@/lib/types";\n`;
      }
      return res.trim();
    });
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(file, content);
  }
}
