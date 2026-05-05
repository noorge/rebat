#!/bin/bash
# Start Rebat platform in development mode

echo "Starting Rebat platform..."

# Start API
cd apps/api
DATABASE_URL="postgresql://rebat:rebat_dev@localhost:5432/rebat?schema=public" node ../../apps/api/dist/src/main.js &
API_PID=$!
echo "API started (PID $API_PID) on http://localhost:3001"

# Start Web
cd ../../apps/web
NEXT_PUBLIC_API_URL=http://localhost:3001 node_modules/.bin/next start &
WEB_PID=$!
echo "Web started (PID $WEB_PID) on http://localhost:3000"

echo ""
echo "Rebat is running!"
echo "  Investor portal: http://localhost:3000"
echo "  Admin panel:     http://localhost:3000/admin"
echo "  API:             http://localhost:3001"
echo ""
echo "Demo admin login: admin@rebat.sa / Admin@12345"
echo ""
echo "Press Ctrl+C to stop all services"

wait
