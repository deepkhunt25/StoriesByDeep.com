# StoriesByDeep.com — GitHub Live Deploy

**GitHub Account:** [deepkhunt25](https://github.com/deepkhunt25)  
**Repository:** [StoriesByDeep.com](https://github.com/deepkhunt25/StoriesByDeep.com)

---

## ઝડપી રીત (Recommended)

### Windows
1. `deploy-github.bat` પર **double-click** કરો
2. Browser માં GitHub login કરો (deepkhunt25 account)
3. Code push થશે → site live થશે

### macOS / Linux
1. Terminal open કરી project root directory માં જાઓ.
2. આ command run કરો:
   ```bash
   ./deploy-github.sh
   ```
3. Prompt થાય ત્યારે commit message લખો અને changes auto-deploy થશે.


**Live URLs:**
- https://deepkhunt25.github.io/StoriesByDeep.com/
- https://storiesbydeep.com (DNS setup પછી)

---

## Manual Commands

### Windows (PowerShell)
```powershell
cd "d:\Deeps Reel\Website"

# 1. Login
& "C:\Program Files\GitHub CLI\gh.exe" auth login

# 2. Connect repo
& "C:\Program Files\Git\bin\git.exe" remote add origin https://github.com/deepkhunt25/StoriesByDeep.com.git

# 3. Push
& "C:\Program Files\Git\bin\git.exe" push -u origin main --force
```

### macOS / Linux (Terminal)
```bash
cd "/Users/cms/Documents/protfolio/Website - 2"

# 1. Login (optional, if gh CLI is installed)
gh auth login

# 2. Connect repo
git remote add origin https://github.com/deepkhunt25/StoriesByDeep.com.git

# 3. Push
git push -u origin main --force
```

## GitHub Pages Enable કરો

GitHub.com → **StoriesByDeep.com** repo → **Settings** → **Pages**
- Branch: `main`
- Folder: `/ (root)`
- Custom domain: `storiesbydeep.com` → Save

## Domain DNS (storiesbydeep.com)

તમારા domain provider (GoDaddy, Namecheap, etc.) પર:

| Type  | Name | Value                    |
|-------|------|--------------------------|
| CNAME | www  | deepkhunt25.github.io    |
| A     | @    | 185.199.108.153          |
| A     | @    | 185.199.109.153          |
| A     | @    | 185.199.110.153          |
| A     | @    | 185.199.111.153          |

DNS update પછી 10-30 મિનિટ wait કરો.

---

## Updates (video add કર્યા પછી)

### Windows (PowerShell)
```powershell
cd "d:\Deeps Reel\Website"
git add .
git commit -m "Update videos"
git push
```

### macOS / Linux (Terminal)
```bash
cd "/Users/cms/Documents/protfolio/Website - 2"
git add .
git commit -m "Update videos"
git push
```
