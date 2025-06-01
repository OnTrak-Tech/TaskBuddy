resource "aws_amplify_app" "frontend" {
  name         = "${var.app_name}-${var.env}"
  repository   = var.repository_url
  access_token = var.access_token

  build_spec = <<-EOT
    version: 1
    frontend:
      phases:
        preBuild:
          commands:
            - cd frontend
            - npm ci
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: frontend/.next
        files:
          - '**/*'
      cache:
        paths:
          - frontend/node_modules/**/*
  EOT

  environment_variables = {
    ENV                     = var.env
    AMPLIFY_DIFF_DEPLOY     = "false"
    AMPLIFY_MONOREPO_APP_ROOT = "frontend"
  }

  custom_rule {
    source = "/<*>"
    status = "404-200"
    target = "/index.html"
  }
}

locals {
  env_stage_map = {
    dev  = "DEVELOPMENT"
    prod = "PRODUCTION"
    beta = "BETA"
    # add other mappings as needed
  }
}
resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.frontend.id
  branch_name = "main"

  framework = "Next.js - SSR"
  stage     = lookup(local.env_stage_map, var.env, "DEVELOPMENT")

  environment_variables = {
    NEXT_PUBLIC_API_URL = var.api_gateway_url
    NEXT_PUBLIC_COGNITO_USER_POOL_ID = var.cognito_user_pool_id
    NEXT_PUBLIC_COGNITO_CLIENT_ID = var.cognito_user_pool_client_id
    NEXT_PUBLIC_REGION = var.aws_region
  }
}