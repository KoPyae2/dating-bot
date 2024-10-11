# Telegram Dating Bot

A Telegram bot designed to facilitate connections between users through a dating-like interface. The bot allows users to register, interact with profiles, and receive notifications about mutual interests.

## Features

- User registration and profile creation
- Matching functionality based on user preferences
- Notifications for users who express interest in each other
- Automatic handling of blocked users
- Session management using MongoDB
- User interaction through Telegram buttons and inline keyboards

## Requirements

- [Node.js](https://nodejs.org/) (v14 or above)
- [Telegram Bot API Token](https://core.telegram.org/bots#botfather)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or a local MongoDB instance
- **Environment Variables**:
  - `PORT`: Port the bot will run on (default: `3000`)
  - `BOT_TOKEN`: Your Telegram Bot token from [BotFather](https://core.telegram.org/bots#botfather)
  - `MONGODB_URL`: Your MongoDB connection string
  - `GEOCODING_API_KEY`: Your geocoding API key (if needed)
  - `MIN_AGE`: Minimum allowed age for users (default: `16`)
  - `MAX_AGE`: Maximum allowed age for users (default: `50`)

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/telegram-dating-bot.git
   cd telegram-dating-bot

   ```bash
   npm install

   ```bash
   npm run build && npm run start 

   ```bash
   npm run dev
   
