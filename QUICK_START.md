# Quick Start Guide

## ✅ Node.js and pnpm Setup

**Good news!** Node.js and pnpm are now set up in your current terminal session.

**Important**: If you open a new terminal, you may need to add Node.js to your PATH again, or make it permanent (see below).

## 🚀 Running the Project

### Option 1: Run Both Apps (Recommended)

From the project root:
```powershell
pnpm install
pnpm local
```

This will start both the web dashboard and mobile app.

### Option 2: Run Web App Only

```powershell
cd apps/web
pnpm install
pnpm dev
```

Then open: **http://localhost:3000**

### Option 3: Run Mobile App Only

```powershell
cd apps/mobile
pnpm install
pnpm dev
```

## 🔧 Making Node.js PATH Permanent

To avoid adding Node.js to PATH every time you open a terminal:

1. **Open Windows Settings** → System → About → Advanced system settings
2. Click **Environment Variables**
3. Under "System variables", find and select **Path**, then click **Edit**
4. Click **New** and add: `C:\Program Files\nodejs`
5. Click **OK** on all dialogs
6. **Restart your terminal/IDE**

## 📝 Current Status

- ✅ Node.js v24.12.0 - Working
- ✅ npm v11.6.2 - Working  
- ✅ pnpm - Installed and working
- 🔄 Dependencies - Need to install (run `pnpm install`)

## 🎨 What You'll See

After running the apps, you'll see the **Liquid Glass** theme with:
- Frosted glass effects
- Gradient backgrounds
- Smooth animations
- Modern, premium UI

Enjoy! 🚗✨

