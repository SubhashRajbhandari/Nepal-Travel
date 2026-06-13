const fs = require('fs');
function fixEnums(file) {
  if(!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/statusColor\[(review|suggestion|user)\.status[^\]]*\]/g, "statusColor[$1.status as keyof typeof statusColor]");
  fs.writeFileSync(file, content);
}

fixEnums('app/admin/reviews/page.tsx');
fixEnums('app/admin/suggestions/page.tsx');
fixEnums('app/admin/users/page.tsx');
fixEnums('app/dashboard/reviews/page.tsx');
fixEnums('app/dashboard/suggest-destination/page.tsx');
