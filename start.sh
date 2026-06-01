#!/bin/bash

# Function to handle cleanup on Ctrl+C
cleanup() {
    echo -e "\nStopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit
}

# Trap the SIGINT (Ctrl+C) and SIGTERM signals
trap cleanup SIGINT SIGTERM

echo "Starting Django backend..."
cd backend || exit
# Activate virtual environment
source venv/bin/activate
# Run Django server in the background
python manage.py runserver &
BACKEND_PID=$!
cd ..

echo "--------------------------------------------------------"
echo "To use the advanced Dukan AI chat, you can provide an OpenRouter API key."
echo "If you don't have one, just press Enter to use the basic offline AI."
read -p "Enter OpenRouter API Key (sk-or-...): " OPENROUTER_KEY

if [ -n "$OPENROUTER_KEY" ]; then
    echo "VITE_OPENROUTER_API_KEY=$OPENROUTER_KEY" > frontend/.env.local
    echo "API Key saved to frontend/.env.local"
else
    echo "VITE_OPENROUTER_API_KEY=" > frontend/.env.local
    echo "Skipped API Key. Basic offline AI will be used."
fi
echo "--------------------------------------------------------"

echo "Starting Vite frontend..."
cd frontend || exit
# Install dependencies if needed
npm install
# Run Vite dev server in the background
npm run dev &
FRONTEND_PID=$!
cd ..

echo "Waiting for servers to initialize..."
sleep 3

echo "Opening browser..."
# Use xdg-open for Linux, open for macOS
if command -v xdg-open &> /dev/null; then
    xdg-open "http://localhost:5173"
elif command -v open &> /dev/null; then
    open "http://localhost:5173"
else
    echo "Could not detect a default web browser. Please manually visit http://localhost:5173"
fi

echo "Both servers are running! Press Ctrl+C to stop them."
# Wait for background processes to keep the script running
wait $BACKEND_PID $FRONTEND_PID
