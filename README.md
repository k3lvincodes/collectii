# Collectii

## Project Structure
- **/frontend**: React + Vite application (The main dashboard)
- **/backend**: Node.js + Express API (Server side logic)
- **/docs**: Documentation

## Getting Started

### Prerequisites
- Node.js (v18+)
- Supabase project

### Setup
1. Install dependencies:
   ```bash
   npm run install:all
   ```

2. Configure Environment:
   - Copy `frontend/.env.example` to `frontend/.env` and fill in Supabase credentials.
   - Copy `backend/.env.example` to `backend/.env` and fill in credentials.

### Running the App
Run the frontend and backend in separate terminals:

**Frontend:**
```bash
npm run dev:frontend
```

**Backend:**
```bash
npm run dev:backend
```
