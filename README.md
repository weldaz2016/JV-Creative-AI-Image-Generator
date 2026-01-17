# JV-Creative-AI-Image-Generator
An all in one AI Powered Graphics Image Generator 

## Preview
Run a local server to view the PWA layout:

```bash
python -m http.server 8000
```

Then open `http://127.0.0.1:8000/` in your browser.

## Production setup

### Backend (Node + Express)
```bash
cd server
cp .env.example .env
npm install
npm run dev
```

### Frontend (static)
```bash
python -m http.server 8000
```

### Docker (optional)
```bash
cd infra
docker compose up --build
```
