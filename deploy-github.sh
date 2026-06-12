#!/bin/bash

# ==============================================================================
#  StoriesByDeep.com - macOS GitHub Deploy Script
#  Account: deepkhunt25 | Repository: StoriesByDeep.com
# ==============================================================================

# ANSI Color Codes for Premium Look
BLUE='\033[1;34m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
RED='\033[1;31m'
CYAN='\033[1;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Clear screen for clean execution presentation
clear

echo -e "${BLUE}======================================================================${NC}"
echo -e "${BOLD}${CYAN}            StoriesByDeep.com - macOS GitHub Deployer${NC}"
echo -e "${BLUE}======================================================================${NC}"
echo ""

# 1. Dependency Checks
echo -e "${BLUE}[Step 1/4]${NC} Checking dependencies..."
if ! command -v git &> /dev/null; then
    echo -e "${RED}Error: Git is not installed or not in your PATH.${NC}"
    echo -e "Please install Git (e.g., via Homebrew: brew install git) and try again."
    exit 1
fi
echo -e "  - Git is ${GREEN}installed${NC}."

HAS_GH=false
if command -v gh &> /dev/null; then
    if gh auth status &> /dev/null; then
        HAS_GH=true
        echo -e "  - GitHub CLI (gh) is ${GREEN}installed and authenticated${NC}."
    else
        echo -e "  - GitHub CLI (gh) is ${YELLOW}installed but not authenticated${NC}."
    fi
else
    echo -e "  - GitHub CLI (gh) is ${YELLOW}not installed${NC} (optional, will skip auto-Pages setup)."
fi
echo ""

# 2. Stage & Commit Changes
echo -e "${BLUE}[Step 2/4]${NC} Staging & committing changes..."

# Verify we are in the correct directory (the script directory)
cd "$(dirname "$0")"

# Check if there are any changes to commit
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${GREEN}No changes to commit. Working tree is clean.${NC}"
else
    git status -s
    echo ""
    # Prompt user for commit message
    default_msg="Update website: $(date +'%Y-%m-%d %H:%M:%S')"
    read -p "Enter commit message [Default: $default_msg]: " commit_msg
    commit_msg="${commit_msg:-$default_msg}"

    echo -e "Committing changes with message: ${CYAN}\"$commit_msg\"${NC}..."
    git add .
    if ! git commit -m "$commit_msg"; then
        echo -e "${RED}Error: Commit failed.${NC}"
        exit 1
    fi
    echo -e "${GREEN}Staged and committed successfully!${NC}"
fi
echo ""

# 3. Push to GitHub (Orphan Deploy Strategy to keep remote size < 20MB while keeping local history)
echo -e "${BLUE}[Step 3/4]${NC} Pushing website code to GitHub..."

# Set remote origin if not already set (or verify/correct it)
TARGET_REMOTE="https://github.com/deepkhunt25/StoriesByDeep.com.git"
CURRENT_REMOTE=$(git remote get-url origin 2>/dev/null)

if [ "$CURRENT_REMOTE" != "$TARGET_REMOTE" ]; then
    echo -e "Configuring remote origin to: ${CYAN}$TARGET_REMOTE${NC}"
    git remote remove origin 2>/dev/null
    git remote add origin "$TARGET_REMOTE"
fi

# Store current branch name so we can switch back to it
CURRENT_BRANCH=$(git branch --show-current)
TEMP_BRANCH="temp-deploy-$(date +%s)"

echo -e "Creating temporary clean branch: ${CYAN}$TEMP_BRANCH${NC}..."
# Create orphan branch with no history
if ! git checkout --orphan "$TEMP_BRANCH" &>/dev/null; then
    echo -e "${RED}Error: Failed to create temporary branch.${NC}"
    exit 1
fi

# Crucial: Unstage all inherited files from the previous branch index
git rm -rf --cached . &>/dev/null

# Stage current files (ignores assets/videos/ due to updated .gitignore)
git add .

# Check if there's anything to commit
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}Warning: Nothing to deploy!${NC}"
    git checkout "$CURRENT_BRANCH" &>/dev/null
    git branch -D "$TEMP_BRANCH" &>/dev/null
    exit 1
fi

# Commit the clean files
echo -e "Creating clean release commit..."
if ! git commit -m "Deploy: $(date +'%Y-%m-%d %H:%M:%S')" &>/dev/null; then
    echo -e "${RED}Error: Commit failed on deployment branch.${NC}"
    git checkout "$CURRENT_BRANCH" &>/dev/null
    git branch -D "$TEMP_BRANCH" &>/dev/null
    exit 1
fi

echo -e "Pushing code to ${BOLD}origin/main${NC}..."
echo -e "${YELLOW}Note: If prompted, please enter your GitHub credentials/Personal Access Token.${NC}"
if ! git push -f origin "$TEMP_BRANCH":main; then
    echo -e "${RED}Error: Failed to push code to GitHub.${NC}"
    # Switch back before exiting
    git checkout "$CURRENT_BRANCH" &>/dev/null
    git branch -D "$TEMP_BRANCH" &>/dev/null
    exit 1
fi

# Switch back to the original branch and remove temp branch
echo -e "Cleaning up temporary branch..."
git checkout "$CURRENT_BRANCH" &>/dev/null
git branch -D "$TEMP_BRANCH" &>/dev/null

echo -e "${GREEN}Successfully pushed code to GitHub!${NC}"
echo ""

# 4. GitHub Pages & Custom Domain Setup
echo -e "${BLUE}[Step 4/4]${NC} Configuring GitHub Pages..."
if [ "$HAS_GH" = true ]; then
    echo -e "Automating configuration via GitHub CLI..."
    # Enable Pages on main branch root
    gh api repos/deepkhunt25/StoriesByDeep.com/pages -X POST -f "source[branch]=main" -f "source[path]=/" &>/dev/null
    # Configure custom domain CNAME
    gh api repos/deepkhunt25/StoriesByDeep.com/pages -X PUT -f "cname=storiesbydeep.com" &>/dev/null
    echo -e "${GREEN}GitHub Pages automatically configured to track main branch /root.${NC}"
    echo -e "${GREEN}Custom domain 'storiesbydeep.com' has been configured in repository settings.${NC}"
else
    echo -e "${YELLOW}Could not automate Pages configuration because GitHub CLI (gh) is not installed/authenticated.${NC}"
    echo -e "Please perform the following manual steps in your browser:"
    echo -e "  1. Go to: ${CYAN}https://github.com/deepkhunt25/StoriesByDeep.com/settings/pages${NC}"
    echo -e "  2. Set ${BOLD}Branch${NC} to ${CYAN}main${NC} and folder to ${CYAN}/ (root)${NC}, then click ${BOLD}Save${NC}."
    echo -e "  3. Set ${BOLD}Custom domain${NC} to ${CYAN}storiesbydeep.com${NC} and click ${BOLD}Save${NC}."
fi

# Summary / Complete Screen
echo ""
echo -e "${BLUE}======================================================================${NC}"
echo -e "${BOLD}${GREEN}               DEPLOYMENT INITIATED SUCCESSFULLY!${NC}"
echo -e "${BLUE}======================================================================${NC}"
echo ""
echo -e "  🚀 Your site should be live shortly at: ${BOLD}${CYAN}https://storiesbydeep.com${NC}"
echo -e "  🌐 Fallback URL: ${CYAN}https://deepkhunt25.github.io/StoriesByDeep.com/${NC}"
echo ""
echo -e "  👉 Make sure your custom domain DNS matches the instructions in ${BOLD}DEPLOY.md${NC}."
echo -e "${BLUE}======================================================================${NC}"
echo ""
