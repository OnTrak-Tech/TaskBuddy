provider "aws" {
  region = var.aws_region
}

terraform {
  required_version = ">= 1.0.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
  # Backend configuration - uncomment after running backend-setup.tf
  # backend "s3" {
  #   bucket = "taskbuddy-terraform-state"
  #   key    = "terraform.tfstate"
  #   region = "us-east-1"
  #   dynamodb_table = "taskbuddy-terraform-locks"
  #   encrypt = true
  # }
}

# Cognito User Pool
module "cognito" {
  source = "./modules/cognito"
  app_name = var.app_name
  env = var.env
}

# DynamoDB Tables
module "dynamodb" {
  source = "./modules/dynamodb"
  app_name = var.app_name
  env = var.env
}

# S3 Bucket for file attachments
module "s3" {
  source = "./modules/s3"
  app_name = var.app_name
  env = var.env
}

# Lambda Functions
module "lambda" {
  source = "./modules/lambda"
  app_name = var.app_name
  env = var.env
  cognito_user_pool_id = module.cognito.user_pool_id
  cognito_user_pool_client_id = module.cognito.user_pool_client_id
  users_table_name = module.dynamodb.users_table_name
  tasks_table_name = module.dynamodb.tasks_table_name
  updates_table_name = module.dynamodb.updates_table_name
  notifications_table_name = module.dynamodb.notifications_table_name
  attachments_bucket_name = module.s3.attachments_bucket_name
}

# API Gateway
module "api_gateway" {
  source = "./modules/api_gateway"
  app_name = var.app_name
  env = var.env
  cognito_user_pool_id = module.cognito.user_pool_id
  lambda_functions = module.lambda.function_arns
}

# SNS for notifications
module "sns" {
  source = "./modules/sns"
  app_name = var.app_name
  env = var.env
}

# SES for email notifications
module "ses" {
  source = "./modules/ses"
  app_name = var.app_name
  env = var.env
}

# EventBridge for scheduling
module "eventbridge" {
  source = "./modules/eventbridge"
  app_name = var.app_name
  env = var.env
  lambda_functions = module.lambda.function_arns
}

# Amplify for frontend hosting
module "amplify" {
  source = "./modules/amplify"
  app_name = var.app_name
  env = var.env
  repository_url = var.repository_url
  access_token = var.github_access_token
}