# Get AWS region and account ID
data "aws_region" "current" {}
data "aws_caller_identity" "current" {}

# ===============================
# API Gateway & Authorizer Setup
# ===============================
resource "aws_api_gateway_rest_api" "main" {
  name        = "${var.app_name}-${var.env}-api"
  description = "API Gateway for TaskBuddy"

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_authorizer" "cognito" {
  name          = "cognito-authorizer"
  rest_api_id   = aws_api_gateway_rest_api.main.id
  type          = "COGNITO_USER_POOLS"
  provider_arns = [
    "arn:aws:cognito-idp:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:userpool/${var.cognito_user_pool_id}"
  ]
}

# =========================
# Admin Resource Hierarchy
# =========================
resource "aws_api_gateway_resource" "admin" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_rest_api.main.root_resource_id
  path_part   = "admin"
}

resource "aws_api_gateway_resource" "admin_users" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_resource.admin.id
  path_part   = "users"
}

resource "aws_api_gateway_resource" "admin_tasks" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_resource.admin.id
  path_part   = "tasks"
}

# =======================
# Admin Users Endpoints
# =======================
resource "aws_api_gateway_method" "admin_create_user" {
  rest_api_id         = aws_api_gateway_rest_api.main.id
  resource_id         = aws_api_gateway_resource.admin_users.id
  http_method         = "POST"
  authorization       = "COGNITO_USER_POOLS"
  authorizer_id       = aws_api_gateway_authorizer.cognito.id
  authorization_scopes = ["admin"]
}

resource "aws_api_gateway_integration" "admin_create_user" {
  rest_api_id             = aws_api_gateway_rest_api.main.id
  resource_id             = aws_api_gateway_resource.admin_users.id
  http_method             = "POST"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_functions["admin_create_user"]
}

resource "aws_api_gateway_method" "admin_list_users" {
  rest_api_id         = aws_api_gateway_rest_api.main.id
  resource_id         = aws_api_gateway_resource.admin_users.id
  http_method         = "GET"
  authorization       = "COGNITO_USER_POOLS"
  authorizer_id       = aws_api_gateway_authorizer.cognito.id
  authorization_scopes = ["admin"]
}

resource "aws_api_gateway_integration" "admin_list_users" {
  rest_api_id             = aws_api_gateway_rest_api.main.id
  resource_id             = aws_api_gateway_resource.admin_users.id
  http_method             = "GET"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_functions["list_users"]
}

# =======================
# Admin Tasks Endpoints
# =======================
resource "aws_api_gateway_method" "admin_create_task" {
  rest_api_id         = aws_api_gateway_rest_api.main.id
  resource_id         = aws_api_gateway_resource.admin_tasks.id
  http_method         = "POST"
  authorization       = "COGNITO_USER_POOLS"
  authorizer_id       = aws_api_gateway_authorizer.cognito.id
  authorization_scopes = ["admin"]
}

resource "aws_api_gateway_integration" "admin_create_task" {
  rest_api_id             = aws_api_gateway_rest_api.main.id
  resource_id             = aws_api_gateway_resource.admin_tasks.id
  http_method             = "POST"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_functions["create_task"]
}

resource "aws_api_gateway_method" "admin_list_tasks" {
  rest_api_id         = aws_api_gateway_rest_api.main.id
  resource_id         = aws_api_gateway_resource.admin_tasks.id
  http_method         = "GET"
  authorization       = "COGNITO_USER_POOLS"
  authorizer_id       = aws_api_gateway_authorizer.cognito.id
  authorization_scopes = ["admin"]
}

resource "aws_api_gateway_integration" "admin_list_tasks" {
  rest_api_id             = aws_api_gateway_rest_api.main.id
  resource_id             = aws_api_gateway_resource.admin_tasks.id
  http_method             = "GET"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_functions["list_tasks"]
}

# =======================
# Team Member Task Routes
# =======================
resource "aws_api_gateway_resource" "tasks" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_rest_api.main.root_resource_id
  path_part   = "tasks"
}

resource "aws_api_gateway_method" "list_tasks" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.tasks.id
  http_method   = "GET"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito.id
}

resource "aws_api_gateway_integration" "list_tasks" {
  rest_api_id             = aws_api_gateway_rest_api.main.id
  resource_id             = aws_api_gateway_resource.tasks.id
  http_method             = "GET"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_functions["list_tasks"]
}

# GET /tasks/{taskId}
resource "aws_api_gateway_resource" "task_id" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_resource.tasks.id
  path_part   = "{taskId}"
}

resource "aws_api_gateway_method" "get_task" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.task_id.id
  http_method   = "GET"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito.id
  request_parameters = {
    "method.request.path.taskId" = true
  }
}

resource "aws_api_gateway_integration" "get_task" {
  rest_api_id             = aws_api_gateway_rest_api.main.id
  resource_id             = aws_api_gateway_resource.task_id.id
  http_method             = "GET"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_functions["get_task_details"]
}

# PUT /tasks/{taskId}/status
resource "aws_api_gateway_resource" "task_status" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_resource.task_id.id
  path_part   = "status"
}

resource "aws_api_gateway_method" "update_task_status" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.task_status.id
  http_method   = "PUT"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito.id
  request_parameters = {
    "method.request.path.taskId" = true
  }
}

resource "aws_api_gateway_integration" "update_task_status" {
  rest_api_id             = aws_api_gateway_rest_api.main.id
  resource_id             = aws_api_gateway_resource.task_status.id
  http_method             = "PUT"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_functions["update_task_status"]
}

# ===================
# File Upload/Access
# ===================
resource "aws_api_gateway_resource" "upload" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_rest_api.main.root_resource_id
  path_part   = "upload"
}

resource "aws_api_gateway_method" "generate_upload_url" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.upload.id
  http_method   = "POST"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito.id
}

resource "aws_api_gateway_integration" "generate_upload_url" {
  rest_api_id             = aws_api_gateway_rest_api.main.id
  resource_id             = aws_api_gateway_resource.upload.id
  http_method             = "POST"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_functions["generate_upload_url"]
}

resource "aws_api_gateway_resource" "files" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_rest_api.main.root_resource_id
  path_part   = "files"
}

resource "aws_api_gateway_resource" "files_key" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_resource.files.id
  path_part   = "{key}"
}

resource "aws_api_gateway_method" "get_download_url" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.files_key.id
  http_method   = "GET"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito.id
  request_parameters = {
    "method.request.path.key" = true
  }
}

resource "aws_api_gateway_integration" "get_download_url" {
  rest_api_id             = aws_api_gateway_rest_api.main.id
  resource_id             = aws_api_gateway_resource.files_key.id
  http_method             = "GET"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_functions["get_download_url"]
}

# ============
# Deployment
# ============
resource "aws_api_gateway_deployment" "main" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  stage_name  = var.env

  depends_on = [
    aws_api_gateway_integration.admin_create_user,
    aws_api_gateway_integration.admin_list_users,
    aws_api_gateway_integration.admin_create_task,
    aws_api_gateway_integration.admin_list_tasks,
    aws_api_gateway_integration.list_tasks,
    aws_api_gateway_integration.get_task,
    aws_api_gateway_integration.update_task_status,
    aws_api_gateway_integration.generate_upload_url,
    aws_api_gateway_integration.get_download_url
  ]
}
