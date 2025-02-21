#### AI Chatbot for API Documentation

An AI chat bot for API documentation and code generation. This bot currentlu supports the following APIs:

- [Crustdata API Docs](https://crustdata.notion.site/Crustdata-Discovery-And-Enrichment-API-c66d5236e8ea40df8af114f6d447ab48)
- [NextJS Api Docs](https://nextjs.org/docs)
- [Flutter Api Docs](https://docs.flutter.dev/)

Backend: https://github.com/maheshj01/api-docs-backend


#### Running the Client

Create a `.env` file in the `client` directory with the following content:

```bash
REACT_APP_BACKEND_URL=http://localhost:8000
REACT_APP_BACKEND_WS_URL=ws://localhost:8080
REACT_APP_MODEL_NAME=llama3.1
REACT_APP_SUBDOMAIN=chat.localhost
```

##### Setting up subdmoains

- On macOS/Linux:

```bash
sudo nano /etc/hosts
```

Add this line:

```bash
127.0.0.1   chat.localhost
```

- On Windows:

Edit C:\Windows\System32\drivers\etc\hosts and add:

```bash
127.0.0.1   chat.localhost
```

##### Run the app

```bash
npm ci
HOST=chat.localhost npm run start
```

### Folder Structure

 client/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── styles/
│   ├── components/
│   │   ├── Delete.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── hooks/
│   │   └── useCustomHook.ts
│   ├── pages/
│   │   ├── Home.tsx
│   │   └── About.tsx
│   ├── redux/
│   │   ├── store.ts
│   │   └── slices/
│   │       └── authSlice.ts
│   ├── App.tsx
│   ├── index.tsx
│   ├── markdown.css
│   ├── index.css
│   ├── routes.tsx
│   └── styles/
│       └── main.css
├── package.json
├── tsconfig.json
└── README.md
