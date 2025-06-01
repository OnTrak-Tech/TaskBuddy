# Manual Backend Setup Instructions

Follow these steps to set up the Terraform backend:

1. Create a new directory for the backend setup:
```bash
mkdir -p /home/rocka/TaskBuddy/infrastructure-backend
cd /home/rocka/TaskBuddy/infrastructure-backend
```

2. Create a main.tf file with the following content:
```bash
cat > main.tf << 'EOF'
provider "aws" {
  region = "eu-west-1"
}

resource "aws_s3_bucket" "terraform_state" {
  bucket = "taskbuddy-terraform-state"

  tags = {
    Name        = "TaskBuddy Terraform State"
    Environment = "management"
  }
}

resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_dynamodb_table" "terraform_locks" {
  name         = "taskbuddy-terraform-locks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  tags = {
    Name        = "TaskBuddy Terraform Locks"
    Environment = "management"
  }
}
EOF
```

3. Initialize and apply:
```bash
terraform init
terraform apply
```

4. After the backend resources are created, go back to the main infrastructure directory:
```bash
cd /home/rocka/TaskBuddy/infrastructure
```

5. Initialize with the S3 backend:
```bash
terraform init
```