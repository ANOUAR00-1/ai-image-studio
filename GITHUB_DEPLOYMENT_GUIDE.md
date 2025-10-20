# GitHub Deployment Guide

## 🚀 First Time: Deploy Your Project to GitHub

### Step 1: Create a GitHub Repository

1. Go to [github.com](https://github.com)
2. Click the **"+"** icon in top right → **"New repository"**
3. Fill in details:
   - **Repository name**: `pixfusion-ai-studio`
   - **Description**: "AI-powered image generation studio"
   - **Visibility**: Choose Public or Private
   - ⚠️ **DO NOT** check "Initialize with README" (we already have files)
4. Click **"Create repository"**

### Step 2: Initialize Git (if not already done)

Open your terminal in the project folder and run:

```bash
git init
```

### Step 3: Add All Files to Git

```bash
git add .
```

This stages all your project files for commit.

### Step 4: Make Your First Commit

```bash
git commit -m "Initial commit: PixFusion AI Studio"
```

### Step 5: Connect to GitHub

Replace `YOUR_USERNAME` with your actual GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/pixfusion-ai-studio.git
```

### Step 6: Push to GitHub

```bash
git branch -M main
git push -u origin main
```

Enter your GitHub credentials when prompted.

---

## 🔄 After Making Changes: Update Your Repository

### Every Time You Make Changes:

#### 1. **Check What Changed**
```bash
git status
```
This shows which files were modified, added, or deleted.

#### 2. **Review Your Changes** (Optional but Recommended)
```bash
git diff
```
This shows exactly what code changed.

#### 3. **Stage Your Changes**

**Option A: Add all changes**
```bash
git add .
```

**Option B: Add specific files**
```bash
git add src/app/page.tsx
git add components/ui/button.tsx
```

#### 4. **Commit Your Changes**
Write a clear message describing what you did:

```bash
git commit -m "Add user authentication feature"
```

**Good commit message examples:**
- `"Fix login button not responding"`
- `"Add image generation API integration"`
- `"Update homepage design with new layout"`
- `"Fix: Resolve token expiration bug"`

**Bad commit messages:**
- `"update"` ❌
- `"fix stuff"` ❌
- `"changes"` ❌

#### 5. **Push to GitHub**
```bash
git push
```

---

## 📋 Complete Workflow Example

```bash
# 1. Make changes to your code
# (edit files, add features, fix bugs)

# 2. Check what changed
git status

# 3. Add changes
git add .

# 4. Commit with message
git commit -m "Add forgot password functionality"

# 5. Push to GitHub
git push
```

---

## 🌿 Working with Branches (Recommended for Larger Changes)

Branches let you work on features without affecting the main code.

### Create a New Branch
```bash
git checkout -b feature/new-feature-name
```

### Make Changes and Commit
```bash
git add .
git commit -m "Implement new feature"
```

### Push the Branch to GitHub
```bash
git push -u origin feature/new-feature-name
```

### Merge Branch into Main
```bash
# Switch back to main
git checkout main

# Merge your feature
git merge feature/new-feature-name

# Push to GitHub
git push
```

### Delete the Branch (After Merging)
```bash
git branch -d feature/new-feature-name
git push origin --delete feature/new-feature-name
```

---

## 🔧 Useful Git Commands

### View Commit History
```bash
git log
git log --oneline  # Shorter version
```

### Undo Changes (Before Commit)
```bash
git restore filename.tsx  # Undo changes to a file
git restore .             # Undo all changes
```

### Undo Last Commit (Keep Changes)
```bash
git reset --soft HEAD~1
```

### Pull Latest Changes from GitHub
```bash
git pull
```

### Clone Your Repository to Another Computer
```bash
git clone https://github.com/YOUR_USERNAME/pixfusion-ai-studio.git
```

---

## 📝 Best Practices

### 1. **Commit Often**
- Don't wait until you've changed 50 files
- Make small, logical commits
- Each commit should represent one logical change

### 2. **Write Clear Commit Messages**
Use this format:
```
Type: Brief description (50 chars or less)

Optional detailed explanation if needed.
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code formatting (no logic change)
- `refactor:` Code restructuring
- `test:` Adding tests
- `chore:` Maintenance tasks

**Examples:**
```bash
git commit -m "feat: Add image upload functionality"
git commit -m "fix: Resolve signup token validation error"
git commit -m "docs: Update README with setup instructions"
```

### 3. **Don't Commit Sensitive Information**
Your `.gitignore` file should exclude:
- `.env` files (API keys, passwords)
- `node_modules/`
- Build outputs (`dist/`, `.next/`)
- Log files

**Check your .gitignore includes:**
```
.env
.env.local
node_modules/
.next/
dist/
*.log
```

### 4. **Before Pushing, Always:**
- Test your code
- Make sure it runs without errors
- Review what you're pushing with `git status`

---

## 🚨 Common Issues & Solutions

### Issue: "fatal: remote origin already exists"
**Solution:**
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/pixfusion-ai-studio.git
```

### Issue: "Permission denied (publickey)"
**Solution:** Use HTTPS instead of SSH, or [set up SSH keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)

### Issue: Merge Conflicts
**Solution:**
1. Open the conflicting file
2. Look for conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`)
3. Edit the file to keep the correct code
4. Remove the conflict markers
5. Stage and commit:
```bash
git add .
git commit -m "Resolve merge conflict"
```

### Issue: Accidentally Committed Sensitive Data
**Solution:**
```bash
# Remove from Git but keep file locally
git rm --cached .env
git commit -m "Remove .env from tracking"
git push
```

---

## 🎯 Daily Workflow Summary

### Morning (Start of Day)
```bash
git pull  # Get latest changes
```

### During Development
```bash
# Work on code...
git add .
git commit -m "Descriptive message"
```

### End of Day
```bash
git push  # Upload your work
```

---

## 📚 Additional Resources

- [GitHub Documentation](https://docs.github.com)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [Learn Git Branching (Interactive)](https://learngitbranching.js.org/)
- [Pro Git Book (Free)](https://git-scm.com/book/en/v2)

---

## ✅ Quick Reference Cheat Sheet

```bash
# First time setup
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main

# Daily workflow
git status           # Check changes
git add .           # Stage all changes
git commit -m "msg" # Commit changes
git push            # Upload to GitHub
git pull            # Download from GitHub

# Branching
git checkout -b branch-name  # Create & switch to branch
git checkout main           # Switch to main
git merge branch-name       # Merge branch
git branch -d branch-name   # Delete branch

# Undo operations
git restore file.tsx        # Undo file changes
git reset --soft HEAD~1     # Undo last commit
git revert commit-hash      # Revert specific commit
```

---

## 🎓 Next Steps for Your PixFusion Project

1. **Initialize Git** (if not already done)
2. **Create GitHub repository**
3. **Push your code**
4. **Set up environment variables** on deployment platforms
5. **Consider CI/CD** with GitHub Actions
6. **Deploy** to Vercel/Netlify for frontend
7. **Document** your deployment process

Good luck! 🚀
