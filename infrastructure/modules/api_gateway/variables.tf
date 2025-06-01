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

variable "lambda_functions" {
  description = "Map of Lambda function ARNs"
  type        = map(string)
}