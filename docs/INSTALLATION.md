# WebMate — Installation & Setup Guide

This guide provides step-by-step instructions for configuring, building, and running the WebMate development environment across macOS and Windows.

---

## 1. System Prerequisites

Before beginning, ensure your local development system meets the following requirements:

| Component | Minimum Version | Recommended | Notes |
| :--- | :--- | :--- | :--- |
| **Operating System** | macOS 12+ or Windows 10/11 | Latest | Linux (Ubuntu 22.04+) is also supported |
| **Node.js** | `>= 20.10.0` (LTS) | `v22.x` | Check with `node -v` |
| **pnpm** | `>= 9.0.0` | Latest 9.x | Check with `pnpm -v` |
| **Browser** | Google Chrome 116+ | Latest Chrome | Any Chromium browser (Brave, Edge) with MV3 support |

### Installing Node.js & pnpm

#### macOS:
```bash
# Using Homebrew:
brew install node
corepack enable
corepack prepare pnpm@latest --activate
```
*(Or install Node via [nvm](https://github.com/nvm-sh/nvm): `nvm install 22 && nvm use 22`)*

#### Windows:
1. Download and run the Node.js LTS installer from [nodejs.org](https://nodejs.org/).
2. Open PowerShell as Administrator and enable `pnpm`:
   ```powershell
   corepack enable
   corepack prepare pnpm@latest --activate
   ```

---

## 2. Project Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/<your-username>/WebMate.git
cd WebMate
```

### Step 2: Install Monorepo Dependencies
From the repository root, install dependencies across all workspaces using pnpm:
```bash
pnpm install
```
This installs dependencies for `@webmate/shared`, `@webmate/backend`, and `@webmate/extension`.

### Step 3: Configure Environment Variables
Copy the template configuration file:
```bash
# On macOS / Linux:
cp .env.example .env

# On Windows (PowerShell):
copy .env.example .env
```

Open `.env` in your text editor. In Phase 0, the default settings (`PORT=4000`, `HOST=127.0.0.1`) are sufficient. AI provider keys can remain empty until Phase 3.

---

## 3. Running WebMate in Development

### Running the Backend Service
From the repository root:
```bash
pnpm dev:backend
```
The Fastify server starts in watch mode at `http://127.0.0.1:4000`. You can verify it is healthy by visiting:
[http://127.0.0.1:4000/health](http://127.0.0.1:4000/health)

### Running the Chrome Extension Client
From the repository root:
```bash
pnpm dev:extension
```
WXT will compile the extension in development mode and watch for file changes, outputting the unpacked extension bundle to:
`apps/extension/.output/chrome-mv3`

---

## 4. Loading the Extension into Google Chrome

To test the extension live in Google Chrome:

1. Open Google Chrome.
2. Navigate to `chrome://extensions/` in the address bar.
3. Toggle the **Developer mode** switch in the top-right corner to **ON**.
4. Click the **Load unpacked** button in the top-left toolbar.
5. In the file picker, select the directory:
   `<your-path-to>/WebMate/apps/extension/.output/chrome-mv3`
6. The **WebMate** extension icon will now appear in your extensions list.
7. Click the WebMate extension icon in the Chrome toolbar to inspect the Phase 0 popup.

---

## 5. Troubleshooting

### Issue 1: `pnpm: command not found`
**Solution**: Ensure Node Corepack is enabled:
```bash
corepack enable
corepack prepare pnpm@latest --activate
```
Alternatively, install pnpm globally via npm:
```bash
npm install -g pnpm
```

### Issue 2: Port 4000 Already in Use
**Solution**: If another process is using port 4000, adjust `PORT` in your local `.env` file:
```env
PORT=4001
```

### Issue 3: Chrome Shows "Manifest file is missing or unreadable"
**Solution**: Make sure you select the compiled `.output/chrome-mv3` folder inside `apps/extension`, **not** the `apps/extension` root folder. Ensure `pnpm dev:extension` or `pnpm build:extension` has run successfully.
