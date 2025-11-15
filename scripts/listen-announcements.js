#!/usr/bin/env node

const { io } = require('socket.io-client');

const socket = io('http://localhost:3000/announcements', {
  transports: ['websocket'],
});

console.log('🔌 Connecting to WebSocket server...');
console.log('📍 Server: http://localhost:3000/announcements');
console.log('⏳ Waiting for announcements...\n');

socket.on('connect', () => {
  console.log('✅ Connected to WebSocket server');
  console.log('👂 Listening for announcement:created events...\n');
});

socket.on('disconnect', () => {
  console.log('\n❌ Disconnected from WebSocket server');
});

socket.on('connect_error', (error) => {
  console.error('❌ Connection error:', error.message);
  console.log('\n💡 Make sure the NestJS server is running on port 3000');
  process.exit(1);
});

socket.on('announcement:created', (announcement) => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📢 NEW ANNOUNCEMENT RECEIVED');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`ID:       ${announcement.id}`);
  console.log(`Title:    ${announcement.title}`);
  console.log(`Category: ${announcement.category}`);
  console.log(`Body:     ${announcement.body}`);
  console.log(`Created:  ${new Date(announcement.createdAt).toLocaleString()}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Disconnecting...');
  socket.disconnect();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Disconnecting...');
  socket.disconnect();
  process.exit(0);
});
