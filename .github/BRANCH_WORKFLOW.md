# Branch Workflow

This repository uses a staging branch workflow for safe deployments and previews.

## Branch Structure

- **`main`** - Production branch (deployed to production Vercel)
- **`staging`** - Preview branch (deployed to staging Vercel preview)
- **`feature/*`** - Feature branches for development

## Workflow

1. **Feature Development**:
   ```bash
   git checkout -b feature/your-feature-name
   # Make changes
   git push -u origin feature/your-feature-name
   # Create PR to staging
   ```

2. **Preview & Testing**:
   - PRs merge to `staging` branch
   - Vercel automatically deploys staging for preview
   - Test the staging deployment before production

3. **Production Deployment**:
   ```bash
   # When staging is ready for production
   git checkout main
   git merge staging
   git push origin main
   ```
   - Or create PR from `staging` → `main`

## Vercel Configuration

- **Production**: `main` branch → `yoursite.vercel.app`
- **Preview**: `staging` branch → `yoursite-git-staging.vercel.app`
- **Branch Previews**: Feature branches get automatic preview URLs

## Benefits

- ✅ Safe testing environment before production
- ✅ Automatic preview deployments for all branches
- ✅ Easy rollback if issues are found
- ✅ Clean git history with controlled merges