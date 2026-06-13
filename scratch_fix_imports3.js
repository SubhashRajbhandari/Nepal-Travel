const fs = require('fs');

function replace(file, find, replaceWith) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.split(find).join(replaceWith);
  fs.writeFileSync(file, content);
}

replace('components/destination/DestinationCard.tsx', 'import { Difficulty } from "@/lib/generated/prisma/client";', 'import { Difficulty } from "@/lib/types";');
replace('lib/ai/itinerary.ts', 'import { Difficulty } from "@/lib/generated/prisma/client";', 'import { Difficulty } from "@/lib/types";');

let authContent = fs.readFileSync('lib/auth.ts', 'utf8');
authContent = authContent.replace('user.role as Role', 'user.role');
authContent = authContent.replace('role: user.role,', 'role: user.role as import("@/lib/types").Role,');
fs.writeFileSync('lib/auth.ts', authContent);

// Fix app/api/ai/itinerary/route.ts
let itineraryRoute = fs.readFileSync('app/api/ai/itinerary/route.ts', 'utf8');
itineraryRoute = itineraryRoute.replace('days: parsed.days,', 'days: JSON.stringify(parsed.days),');
itineraryRoute = itineraryRoute.replace('costEstimate: parsed.costEstimate,', 'costEstimate: JSON.stringify(parsed.costEstimate),');
fs.writeFileSync('app/api/ai/itinerary/route.ts', itineraryRoute);

// Fix app/dashboard/saved-destinations/page.tsx
let savedDest = fs.readFileSync('app/dashboard/saved-destinations/page.tsx', 'utf8');
savedDest = savedDest.replace('destination: bookmark.destination,', 'destination: parseDestination(bookmark.destination as any) as any,');
fs.writeFileSync('app/dashboard/saved-destinations/page.tsx', savedDest);

// Fix enum indexing errors
function fixEnums(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/statusColor\[(review|suggestion)\.status\]/g, "statusColor[$1.status as 'PENDING' | 'APPROVED' | 'REJECTED']");
  content = content.replace(/statusColor\[user\.status\]/g, "statusColor[user.status as 'ACTIVE' | 'PENDING' | 'BLOCKED']");
  fs.writeFileSync(file, content);
}

fixEnums('app/admin/reviews/page.tsx');
fixEnums('app/admin/suggestions/page.tsx');
fixEnums('app/admin/users/page.tsx');
fixEnums('app/dashboard/reviews/page.tsx');
fixEnums('app/dashboard/suggest-destination/page.tsx');
