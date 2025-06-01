variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "app_name" {
  description = "Application name"
  type        = string
  default     = "taskbuddy"
}

variable "env" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "repository_url" {
  description = "GitHub repository URL for Amplify"
  type        = string
}

variable "github_access_token" {
  description = "GitHub access token for Amplify"
  type        = string
  sensitive   = true
}