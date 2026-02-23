# Feature Flags Management System

A full-stack web application for managing feature flags with support for global, user-specific, group-specific, and region-based overrides. Built with React (frontend) and Node.js/Express/MongoDB (backend).

## Features

- **Create Feature Flags**: Define features with a name, description, default state, and region.
- **Runtime Evaluation**: Check if a feature is enabled for a given context (user, group, region).
- **Override Management**: Add, update, and delete overrides for users, groups, or regions.
- **Priority-Based Evaluation**: User > Group > Region > Global default.
- **Responsive UI**: Clean, intuitive interface for managing and evaluating features.

## Tech Stack

- **Frontend**: React, CSS
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Database**: MongoDB (local or cloud)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/feature-flags.git
cd feature-flags
```

### 2. Backend Setup
```bash
cd src/servers
npm install
```

Create a `.env` file in `src/servers/` with:
```
MONGO_URI=mongodb://localhost:27017/featureflags  # or your MongoDB Atlas URI
PORT=5000
```

Start the backend:
```bash
npm start
```
The server runs on `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd ..  # back to root
npm install
npm start
```
The app runs on `http://localhost:3000`.

## Usage

1. **Create a Feature**: Use the "Create Feature" form to add a new feature flag.
2. **Manage Overrides**: Click "Manage Overrides" on a feature to add user/group/region-specific rules.
3. **Evaluate Features**: Use the "Evaluate Feature" section to check enablement based on context.

### Example
- Create feature "new_ui" (default: enabled, region: All).
- Add override: User "alice" → disabled.
- Evaluate for userId "alice" → Disabled (user override wins).

## Recommended VS Code Extensions

- **ES7+ React/Redux/React-Native snippets** (for React development)
- **Prettier** (code formatting)
- **ESLint** (linting)
- **MongoDB for VS Code** (database management)
- **Thunder Client** or **REST Client** (API testing)

## Project Structure

```
feature-flags/
├── public/
├── src/
│   ├── api/           # API calls
│   ├── components/    # React components
│   │   ├── CreateFeatureForm.js
│   │   ├── EvaluateFeature.js
│   │   └── FeatureList.js
│   ├── servers/       # Backend
│   │   ├── server.js
│   │   └── package.json
│   └── App.js
├── package.json
└── README.md
```

## API Endpoints

- `GET /api/features` - List all features
- `POST /api/features` - Create a feature
- `GET /api/features/:key/evaluate?userId=X&groupId=Y&region=Z` - Evaluate feature

## Contributing

1. Fork the repo.
2. Create a feature branch.
3. Commit changes.
4. Push and create a PR.
