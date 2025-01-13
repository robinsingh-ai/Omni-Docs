# Git Workflow Guide for Collaboration

## 1. **Setting Up the Repository**

- **Clone the repository**:
  First, each of you should clone the repository to your local machines.

  ```bash
  git clone <repository-url>
  cd <repository-name>
  ```

## 2. **Create Your Own Branch**

- To keep things organized and avoid conflicts, **create a new branch** for each task or feature you are working on. This keeps your changes separate from the main codebase.

  ```bash
  git checkout -b <feature-branch-name>
  ```

  Example:
  ```bash
  git checkout -b login-feature
  ```

## 3. **Work on Your Branch**

- Make your changes on your branch. This can include editing, adding new features, or fixing bugs.
- After making your changes, **stage** and **commit** them.

  ```bash
  git add .
  git commit -m "Descriptive message of what you changed"
  ```

  Example:
  ```bash
  git commit -m "Add Google Sign-In functionality"
  ```

## 4. **Pull the Latest Changes**

- Before pushing your branch, **pull the latest changes** from the `main` branch to avoid conflicts. If other team members have made changes, this ensures your local repository is up to date.

  ```bash
  git checkout main
  git pull origin main
  ```

- After updating the `main` branch, switch back to your working branch.

  ```bash
  git checkout <feature-branch-name>
  ```

## 5. **Push Your Branch to the Remote Repository**

- Once your work is complete, push your branch to the remote repository so others can see your progress.

  ```bash
  git push origin <feature-branch-name>
  ```

  Example:
  ```bash
  git push origin login-feature
  ```

## 6. **Create a Pull Request (PR)**

- After pushing your branch, **create a Pull Request (PR)** to merge your changes into the `main` branch.
- Add a clear description of what the PR does and any important context for the reviewers.

## 7. **Review and Merge**

- Once your PR is created, your collaborator (or yourself) will review the code to ensure everything is working as expected.
- After the review, **merge the PR** into the `main` branch.

  ```bash
  git checkout main
  git pull origin main  # To get the latest updates
  git merge <feature-branch-name>
  git push origin main
  ```

## 8. **Delete Your Feature Branch (Optional)**

- After the PR is merged, **delete the feature branch** to keep the repository clean.

  ```bash
  git branch -d <feature-branch-name>
  git push origin --delete <feature-branch-name>
  ```

---

### Key Tips:

- **Use Descriptive Commit Messages**: This will make it easier to understand the history of the project.
- **Rebase**: If working on long-running branches, consider using `git rebase` instead of `git merge` to keep a cleaner history.
- **Avoid Directly Pushing to the Main Branch**: Always work on feature branches and use pull requests for merging.

---

This workflow ensures that both of you can work on separate features without stepping on each other's toes, and any conflicts are resolved early on.