# This file is used to create the S3 bucket and DynamoDB table for Terraform state management
# Run this first with: terraform apply -target=aws_s3_bucket.terraform_state -target=aws_dynamodb_table.terraform_locks
# Then comment out this file and uncomment the backend configuration in main.tf

resource "aws_s3_bucket" "terraform_state" {
  bucket = "taskbuddy-terraform-state"

  lifecycle {
    prevent_destroy = true
  }

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