#!/bin/bash
cd "$(dirname "$0")"
[ ! -f .env.local ] && cp .env.example .env.local
npm install
npm run dev
