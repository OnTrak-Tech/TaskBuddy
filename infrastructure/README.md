# TaskBuddy Infrastructure

This directory contains the Terraform configuration for the TaskBuddy application infrastructure.

## Getting Started

### Step 1: Set up Terraform backend

First, create the S3 bucket and DynamoDB table for Terraform state management:

```bash
# Initialize Terraform
terraform init

# Create backend resources
terraform apply -target=aws_s3_bucket.terraform_state -target=aws_dynamodb_table.terraform_locks
```

### Step 2: Configure backend

After creating the backend resources:

1. Comment out the `backend-setup.tf` file or rename it to `backend-setup.tf.disabled`
2. Uncomment the backend configuration in `main.tf`
3. Run `terraform init` again to initialize the backend

### Step 3: Deploy infrastructure

```bash
# Apply the full infrastructure
terraform apply
```

## Infrastructure Components

- **Cognito**: User authentication with admin and team member groups
- **DynamoDB**: Tables for users, tasks, task updates, and notifications
- **S3**: Secure bucket for file attachments
- **Lambda**: Java functions for API operations
- **API Gateway**: RESTful API with Cognito authorization
- **SNS**: Topics for task notifications
- **SES**: Email templates for notifications
- **EventBridge**: Scheduled rules for deadline checking
- **Amplify**: Frontend hosting for NextJS application

## Variables

Create a `terraform.tfvars` file with the following variables:

```hcl
aws_region         = "us-east-1"
app_name           = "taskbuddy"
env                = "dev"
repository_url     = "https://github.com/yourusername/TaskBuddy"
github_access_token = "your-github-token"
```