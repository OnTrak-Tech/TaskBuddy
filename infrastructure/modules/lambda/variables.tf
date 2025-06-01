variable "app_name" {
  description = "Application name"
  type        = string
}

variable "env" {
  description = "Environment (dev, staging, prod)"
  type        = string
}

variable "cognito_user_pool_id" {
  description = "Cognito User Pool ID"
  type        = string
}

variable "cognito_user_pool_client_id" {
  description = "Cognito User Pool Client ID"
  type        = string
}

variable "users_table_name" {
  description = "DynamoDB Users table name"
  type        = string
}

variable "tasks_table_name" {
  description = "DynamoDB Tasks table name"
  type        = string
}

variable "updates_table_name" {
  description = "DynamoDB Task Updates table name"
  type        = string
}

variable "notifications_table_name" {
  description = "DynamoDB Notifications table name"
  type        = string
}

variable "attachments_bucket_name" {
  description = "S3 Attachments bucket name"
  type        = string
}