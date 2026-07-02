$env:DATABASE_URL="postgresql://neondb_owner:***REMOVED***@***REMOVED***/neondb?sslmode=require&channel_binding=require"
$env:PORT="5000"
$env:SESSION_SECRET="arch-portfolio-secret-dev"
$env:ADMIN_USERNAME="admin"
$env:ADMIN_PASSWORD="admin123"
$env:NODE_ENV="development"
Set-Location "E:\Arch-Portfolio-Prozip\Arch-Portfolio-Prozip"
pnpm --filter @workspace/api-server run dev
