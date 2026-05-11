#!/bin/bash
echo "Starting Server..."
cd server
npm run dev &
SERVER_PID=$!

echo "Starting Client..."
cd ../client
npm run dev &
CLIENT_PID=$!

echo "Both server and client are running."
echo "Press Ctrl+C to stop both."

trap "kill $SERVER_PID $CLIENT_PID" EXIT

wait
