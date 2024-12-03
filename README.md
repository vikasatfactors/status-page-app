# Status Page Application

## 🚀 Project Overview

### Project Scope
A status page application similar to services like Cachet or Openstatus. The application enables administrators to manage services and their statuses while providing a public-facing page for users to view the current status of all services.

## 🛠 Tech Stack

- **Backend**: Go (v1.20)
- **ORM**: GORM
- **Web Framework**: Gin
- **Database**: PostgreSQL (v14)
- **Frontend**: React.js (Node v23.3.0, npm v10.9.0)
- **Authentication**: Auth0
- **UI Components**: shadcn UI
- **Styling**: Tailwind CSS

## ✨ Key Features

### 1. User Authentication
- Secure login and registration using Auth0
- Role-based access control
- Team and organization management

### 2. Service Management
- CRUD operations for services
- Predefined status categories:
  - Operational
  - Degraded Performance
  - Partial Outage
  - Major Outage

### 3. Incident & Maintenance Tracking
- Create, update, and resolve incidents
- Schedule and manage maintenance windows
- Associate incidents with specific services
- Comprehensive incident update logging

### 4. Real-time Status Updates
- WebSocket integration for instant status change notifications
- Live updates across all connected clients

### 5. Public Status Page
- Real-time service status dashboard
- Active incidents and maintenance display
- Historical timeline of service status changes

## 🏗 Architecture

### Backend (Go)
- RESTful API endpoints
- WebSocket support
- GORM for database interactions
- Gin web framework for routing

### Frontend (React)
- Component-based architecture
- Real-time updates using WebSocket
- Responsive design with Tailwind CSS
- Shadcn UI for consistent component styling

### Authentication
- Auth0 for secure authentication
- Role-based access management
- Multi-tenant support

## 📦 Installation

### Prerequisites
- Go 1.20+
- Node.js v23.3.0
- npm 10.9.0
- PostgreSQL 14+
- Auth0 account

### Backend Environment Variables
Create a `.env` file in the backend directory with the following variables:
```
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=vikaskumar
DB_PASSWORD=testpassword
DB_NAME=status_page
PGDATABASE=postgres

# Auth0 Configuration
AUTH0_DOMAIN=dev-1ig767b0haje6gfw.us.auth0.com
AUTH0_AUDIENCE=https://api.mystatuspageapp.com
AUTH0_CLIENT_ID=0uTNTcpK8udddqZU05TJO6zjc9HZRH12
AUTH0_CLIENT_SECRET=2Pj4wa_XU7AYrwDMH8gTf8GlANi5OMvml7ZFN3Ke30LFDmvYBL07HsJsiwIYu9FW

# Server Configuration
PORT=8080
```

### Frontend Environment Variables
Create a `.env` file in the frontend directory with the following variables:
```
VITE_AUTH0_DOMAIN=dev-1ig767b0haje6gfw.us.auth0.com
VITE_AUTH0_CLIENT_ID=OfGVc3NIHcAceJ1e5PA8isrGVH9G4YF3
VITE_AUTH0_CALLBACK_URL=http://localhost:5173
VITE_AUTH0_AUDIENCE=https://api.mystatuspageapp.com
```

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/status-page-app.git

# Navigate to backend directory
cd status-page-app/backend

# Start the server
go run main.go
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔐 Authentication Details

### Auth0 Dummy Account
- **Organization**: awe_org
- **Email**: admin@test.com
- **Password**: admin@123

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact
Your Name - pk2698@gmail.com

Project Link: [Status Page](https://github.com/vikasatfactors/status-page-app)

## ⚠️ Security Note
🚨 **Important**: Replace the dummy credentials with your actual configuration in a real-world deployment.
