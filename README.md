**Welcome to your Base44 project** 

**About**

View and Edit  your app on [Base44.com](http://Base44.com) 

This project contains everything you need to run your app locally.

**Edit the code in your local development environment**

Any change pushed to the repo will also be reflected in the Base44 Builder.

**Prerequisites:** Node.js **20 LTS** (not Node 24). Use [nvm](https://github.com/nvm-sh/nvm) if needed.

1. Clone the repository using the project's Git URL 
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm run setup
   ```
   If `npm install` hangs or loops, run the setup script in **Terminal.app** (not only inside Cursor), and make sure you are on Node 20:
   ```bash
   nvm install 20 && nvm use 20
   npm run setup
   ```
4. Create an `.env.local` file and set the right environment variables

```
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_APP_BASE_URL=your_backend_url

e.g.
VITE_BASE44_APP_ID=cbef744a8545c389ef439ea6
VITE_BASE44_APP_BASE_URL=https://my-to-do-list-81bfaad7.base44.app
```

Run the app: `npm run dev`

**Publish your changes**

Open [Base44.com](http://Base44.com) and click on Publish.

**Docs & Support**

Documentation: [https://docs.base44.com/Integrations/Using-GitHub](https://docs.base44.com/Integrations/Using-GitHub)

Support: [https://app.base44.com/support](https://app.base44.com/support)
