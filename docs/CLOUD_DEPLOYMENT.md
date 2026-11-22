# LunarNote Cloud Deployment & Production Operations Guide

This guide provides end-to-end instructions for deploying the **LunarNote** MERN application across **MongoDB Atlas**, **Docker Hub**, and **Google Cloud Run**, managed automatically via **GitHub Actions CI/CD**.

---

## 1. Architecture Overview

```
                     +---------------------------------------+
                     |            Client Browser             |
                     +---------------------------------------+
                                         |
                                         | HTTPS (Port 443)
                                         v
                     +---------------------------------------+
                     |    Google Cloud Run: Frontend         |
                     |  (Nginx Alpine serving Vite React SPA)|
                     |  Reverse-proxies /api/ requests       |
                     +---------------------------------------+
                                         |
                                         | HTTPS / Internal API
                                         v
                     +---------------------------------------+
                     |    Google Cloud Run: Backend          |
                     |   (Node.js 20 Express Microservice)   |
                     |   Listens on 0.0.0.0:$PORT            |
                     +---------------------------------------+
                                         |
                                         | TLS 1.3 / Port 27017
                                         v
                     +---------------------------------------+
                     |          MongoDB Atlas Cluster        |
                     |         (Cloud Database Cluster)      |
                     +---------------------------------------+
```

---

## 2. Phase A: MongoDB Atlas Database Configuration

### Step 1: Create Cluster
1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create an Organization and a Project (e.g., `lunarnote-production`).
3. Deploy a cluster:
   - For testing/free tier: Select **M0 (Shared)**.
   - Region: Choose a region close to your Google Cloud Run deployment (e.g., `us-central1` or `europe-west1`).
   - Cluster Name: `lunarnote-cluster`.

### Step 2: Database User Security
1. Navigate to **Security** > **Database Access**.
2. Click **Add New Database User**.
3. Authentication Method: **Password**.
4. Set Username: `lunarnote_app`.
5. Set secure password (e.g. generate via password manager).
6. Under **Database User Privileges**, select **Read and write to any database** (or restrict to `blog` database).
7. Click **Add User**.

### Step 3: Network Access (IP Access List)
1. Navigate to **Security** > **Network Access**.
2. Click **Add IP Address**.
3. For serverless Google Cloud Run instances without static outbound IP:
   - Click **Allow Access from Anywhere** (`0.0.0.0/0`).
   - *Security Note*: Authentication is enforced via SCRAM-SHA-256 and TLS encryption.
   - (Optional Enterprise pattern: Configure a Google Cloud Serverless VPC Access connector with Cloud NAT for a static outbound IP).
4. Save entry.

### Step 4: Extract Database Connection URI
1. In **Databases** > **Clusters**, click **Connect**.
2. Choose **Drivers** (Node.js version 5.5 or later).
3. Copy connection string template:
   ```text
   mongodb+srv://lunarnote_app:<PASSWORD>@lunarnote-cluster.xxxxxx.mongodb.net/blog?retryWrites=true&w=majority&appName=LunarNote
   ```
4. Replace `<PASSWORD>` with your database user password and specify `/blog` as the database name.

---

## 3. Phase B: Docker Hub Container Registry

### Step 1: Create Docker Hub Repositories
1. Log in to [Docker Hub](https://hub.docker.com).
2. Create two public or private repositories:
   - `<your-dockerhub-username>/lunarnote-backend`
   - `<your-dockerhub-username>/lunarnote-frontend`

### Step 2: Generate Access Token
1. Click your profile avatar > **Account Settings** > **Security**.
2. Click **New Access Token**.
3. Description: `GitHub-Actions-LunarNote-CI-CD`.
4. Permissions: **Read, Write, Delete**.
5. Save the generated token securely.

### Step 3: Tagging Conventions
Always adhere to dual-tagging:
- Semantic / Commit SHA: `<repo>:<git-commit-sha>` (immutable record for production rollbacks).
- Environment pointer: `<repo>:latest` or `<repo>:staging`.

---

## 4. Phase C: Google Cloud Run Deployment

Google Cloud Run automatically manages autoscaling, HTTPS termination, health checking, and container lifecycles.

### Prerequisites
- Install [Google Cloud SDK (gcloud CLI)](https://cloud.google.com/sdk/docs/install).
- Log in and set your active project:
  ```bash
  gcloud auth login
  gcloud config set project <YOUR_GCP_PROJECT_ID>
  ```
- Enable required Google Cloud APIs:
  ```bash
  gcloud services enable run.googleapis.com \
                         containerregistry.googleapis.com \
                         secretmanager.googleapis.com
  ```

### Step 1: Deploy Backend Microservice
Run the following command to deploy the backend container:
```bash
gcloud run deploy lunarnote-backend \
  --image=<your-dockerhub-username>/lunarnote-backend:latest \
  --region=us-central1 \
  --platform=managed \
  --allow-unauthenticated \
  --port=3000 \
  --memory=512Mi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=10 \
  --set-env-vars="NODE_ENV=production,PORT=3000,DATABASE_URL=mongodb+srv://lunarnote_app:<PASSWORD>@lunarnote-cluster.xxxxxx.mongodb.net/blog?retryWrites=true&w=majority"
```

Once deployment finishes, capture the allocated HTTPS URL:
```bash
BACKEND_URL=$(gcloud run services describe lunarnote-backend --region=us-central1 --format='value(status.url)')
echo "Backend URL: $BACKEND_URL"
```

### Step 2: Deploy Frontend Microservice
Build the frontend Docker image pointing `VITE_BACKEND_URL` to your backend Cloud Run URL (with `/api/v1` path), or serve through Nginx reverse proxy:
```bash
docker build \
  --build-arg VITE_BACKEND_URL="${BACKEND_URL}/api/v1" \
  -t <your-dockerhub-username>/lunarnote-frontend:latest \
  ./ch3S/frontend

docker push <your-dockerhub-username>/lunarnote-frontend:latest
```

Deploy frontend to Google Cloud Run:
```bash
gcloud run deploy lunarnote-frontend \
  --image=<your-dockerhub-username>/lunarnote-frontend:latest \
  --region=us-central1 \
  --platform=managed \
  --allow-unauthenticated \
  --port=80 \
  --memory=256Mi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=10
```

---

## 5. Phase D: Automated CI/CD Setup with GitHub Actions

### Required GitHub Repository Secrets
Navigate to **Settings** > **Secrets and variables** > **Actions** in your GitHub repository and add:

| Secret Name | Description | Example Value |
| :--- | :--- | :--- |
| `DOCKERHUB_USERNAME` | Your Docker Hub account identifier | `johndoe` |
| `DOCKERHUB_TOKEN` | Docker Hub Personal Access Token | `dckr_pat_xxxx` |
| `GCP_PROJECT_ID` | Google Cloud project identifier | `lunarnote-prod-12345` |
| `GCP_REGION` | Cloud Run target region | `us-central1` |
| `GCP_SA_KEY` | Google Service Account JSON Key | `{ "type": "service_account", ... }` |
| `DATABASE_URL` | MongoDB Atlas Connection URI | `mongodb+srv://...` |

### Pipeline Workflows
- **`.github/workflows/backend-ci.yml`**: Triggers on pull requests or pushes to backend files. Validates linting, runs the 31-suite unit tests, and tests container build.
- **`.github/workflows/frontend-ci.yml`**: Triggers on frontend changes. Validates React 19 ESLint compliance, executes Vite production bundling, and verifies multi-stage Nginx container build.
- **`.github/workflows/deploy-cd.yml`**: End-to-end continuous delivery pipeline. Builds both images, tags with short git commit SHA & `:latest`, publishes to Docker Hub, and executes zero-downtime deployment to Cloud Run.
