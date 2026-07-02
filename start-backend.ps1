$env:DATABASE_URL="postgresql://neondb_owner:npg_xZbLOGadcJ20@ep-mute-rice-aof9rs3r-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
$env:PORT="5000"
$env:SESSION_SECRET="arch-portfolio-secret-dev"
$env:ADMIN_USERNAME="admin"
$env:ADMIN_PASSWORD="admin123"
$env:NODE_ENV="development"
Set-Location "E:\Arch-Portfolio-Prozip\Arch-Portfolio-Prozip"
pnpm --filter @workspace/api-server run dev
