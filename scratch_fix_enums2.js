const fs = require('fs');

function fixStatusStyles(file) {
  if(!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/statusStyles\[([a-zA-Z0-9_.]+)\.status\]/g, "statusStyles[$1.status as keyof typeof statusStyles]");
  content = content.replace(/statusColor\[([a-zA-Z0-9_.]+)\.status\]/g, "statusColor[$1.status as keyof typeof statusColor]");
  fs.writeFileSync(file, content);
}

fixStatusStyles('app/admin/reviews/page.tsx');
fixStatusStyles('app/admin/suggestions/page.tsx');
fixStatusStyles('app/admin/users/page.tsx');
fixStatusStyles('app/dashboard/reviews/page.tsx');
fixStatusStyles('app/dashboard/suggest-destination/page.tsx');
