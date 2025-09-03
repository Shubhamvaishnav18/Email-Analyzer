Email Analyzer Project
A full-stack application that connects to email accounts via IMAP, analyzes email headers to trace delivery paths, detects email service providers, and visualizes the results in an interactive dashboard.

🌟 Features
Backend (Node.js)
IMAP Integration: Secure connection to email providers using IMAP protocol

Email Analysis: Parse and extract email headers and metadata

ESP Detection: Automatically identify email service providers (Gmail, Outlook, Amazon SES, etc.)

Receiving Chain Analysis: Trace the complete email delivery path

MongoDB Storage: Save analysis results with timestamps

RESTful API: Clean API endpoints for frontend communication

Frontend (React + Vite)
Interactive Dashboard: Modern, responsive user interface

Real-time Analysis: Connect to email accounts and analyze messages

Visualization: Display receiving chains as timelines and ESP types in cards

Raw Headers View: Complete email header inspection

Responsive Design: Works seamlessly on desktop and mobile devices

🛠️ Tech Stack

Backend
Node.js - Runtime environment

Express.js - Web framework

MongoDB - Database with Mongoose ODM

IMAP - Email protocol integration

Frontend
React.js - UI framework

Vite - Build tool and dev server

Tailwind CSS - Utility-first CSS framework

Axios - HTTP client for API requests

📦 Installation
Prerequisites
Node.js (v16 or higher)

MongoDB (local or cloud instance)

Email account with IMAP access enabled

Backend Setup
Navigate to backend directory:

cd backend

Install dependencies:

npm install

Create environment file:

cp .env.example .env

Configure environment variables:

env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/email_analysis
IMAP_USER=your_email@example.com
IMAP_PASSWORD=your_app_password
IMAP_HOST=imap.example.com
IMAP_PORT=993
IMAP_TLS=true

Start the backend server:

npm run dev

Frontend Setup

Navigate to frontend directory:

cd frontend

Install dependencies:

npm install

Create environment file:

cp .env.example .env

Configure environment variables:

env
VITE_API_BASE_URL=http://localhost:5000/api

Start the development server:

npm run dev

🚀 Usage

Configure Email Connection: Enter your email credentials and IMAP settings

Connect to IMAP: Establish connection to your email account

Analyze Emails: Process emails with optional subject filters

View Results: Explore receiving chains, ESP detection, and raw headers

Save Configuration: Store settings for future sessions

📋 API Endpoints

Email Management
POST /api/email/imap/connect - Connect to IMAP server
POST /api/email/imap/disconnect - Disconnect from IMAP server
POST /api/email/analyze - Analyze emails with optional filters
GET /api/email/results - Retrieve analysis results

