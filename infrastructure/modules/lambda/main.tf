resource "aws_iam_role" "lambda_role" {
  name = "${var.app_name}-${var.env}-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_policy" "lambda_policy" {
  name        = "${var.app_name}-${var.env}-lambda-policy"
  description = "Policy for Lambda functions"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Effect   = "Allow"
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:BatchGetItem",
          "dynamodb:BatchWriteItem"
        ]
        Effect = "Allow"
        Resource = [
          "arn:aws:dynamodb:*:*:table/${var.users_table_name}",
          "arn:aws:dynamodb:*:*:table/${var.tasks_table_name}",
          "arn:aws:dynamodb:*:*:table/${var.updates_table_name}",
          "arn:aws:dynamodb:*:*:table/${var.notifications_table_name}",
          "arn:aws:dynamodb:*:*:table/${var.users_table_name}/index/*",
          "arn:aws:dynamodb:*:*:table/${var.tasks_table_name}/index/*",
          "arn:aws:dynamodb:*:*:table/${var.notifications_table_name}/index/*"
        ]
      },
      {
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Effect   = "Allow"
        Resource = [
          "arn:aws:s3:::${var.attachments_bucket_name}",
          "arn:aws:s3:::${var.attachments_bucket_name}/*"
        ]
      },
      {
        Action = [
          "cognito-idp:AdminCreateUser",
          "cognito-idp:AdminGetUser",
          "cognito-idp:AdminUpdateUserAttributes",
          "cognito-idp:AdminDisableUser",
          "cognito-idp:AdminEnableUser",
          "cognito-idp:ListUsers"
        ]
        Effect   = "Allow"
        Resource = "arn:aws:cognito-idp:*:*:userpool/${var.cognito_user_pool_id}"
      },
      {
        Action = [
          "sns:Publish",
          "ses:SendEmail",
          "ses:SendTemplatedEmail"
        ]
        Effect   = "Allow"
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_policy_attachment" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_policy.arn
}

# User Management Lambda Functions
resource "aws_lambda_function" "admin_create_user" {
  function_name = "${var.app_name}-${var.env}-admin-create-user"
  role          = aws_iam_role.lambda_role.arn
  handler       = "com.taskbuddy.auth.AdminCreateUserHandler"
  runtime       = "java11"
  timeout       = 30
  memory_size   = 512
  
  # This is a placeholder. In a real setup, you would build the JAR and reference it here
  filename      = "${path.module}/dummy.zip"
  
  environment {
    variables = {
      COGNITO_USER_POOL_ID = var.cognito_user_pool_id
      USERS_TABLE_NAME     = var.users_table_name
      ENV                  = var.env
    }
  }
}

resource "aws_lambda_function" "get_user_profile" {
  function_name = "${var.app_name}-${var.env}-get-user-profile"
  role          = aws_iam_role.lambda_role.arn
  handler       = "com.taskbuddy.auth.GetUserProfileHandler"
  runtime       = "java11"
  timeout       = 30
  memory_size   = 512
  
  filename      = "${path.module}/dummy.zip"
  
  environment {
    variables = {
      USERS_TABLE_NAME = var.users_table_name
      ENV              = var.env
    }
  }
}

resource "aws_lambda_function" "update_user_profile" {
  function_name = "${var.app_name}-${var.env}-update-user-profile"
  role          = aws_iam_role.lambda_role.arn
  handler       = "com.taskbuddy.auth.UpdateUserProfileHandler"
  runtime       = "java11"
  timeout       = 30
  memory_size   = 512
  
  filename      = "${path.module}/dummy.zip"
  
  environment {
    variables = {
      COGNITO_USER_POOL_ID = var.cognito_user_pool_id
      USERS_TABLE_NAME     = var.users_table_name
      ENV                  = var.env
    }
  }
}

resource "aws_lambda_function" "list_users" {
  function_name = "${var.app_name}-${var.env}-list-users"
  role          = aws_iam_role.lambda_role.arn
  handler       = "com.taskbuddy.auth.ListUsersHandler"
  runtime       = "java11"
  timeout       = 30
  memory_size   = 512
  
  filename      = "${path.module}/dummy.zip"
  
  environment {
    variables = {
      USERS_TABLE_NAME = var.users_table_name
      ENV              = var.env
    }
  }
}

# Task Management Lambda Functions
resource "aws_lambda_function" "create_task" {
  function_name = "${var.app_name}-${var.env}-create-task"
  role          = aws_iam_role.lambda_role.arn
  handler       = "com.taskbuddy.tasks.CreateTaskHandler"
  runtime       = "java11"
  timeout       = 30
  memory_size   = 512
  
  filename      = "${path.module}/dummy.zip"
  
  environment {
    variables = {
      TASKS_TABLE_NAME = var.tasks_table_name
      ENV              = var.env
    }
  }
}

resource "aws_lambda_function" "assign_task" {
  function_name = "${var.app_name}-${var.env}-assign-task"
  role          = aws_iam_role.lambda_role.arn
  handler       = "com.taskbuddy.tasks.AssignTaskHandler"
  runtime       = "java11"
  timeout       = 30
  memory_size   = 512
  
  filename      = "${path.module}/dummy.zip"
  
  environment {
    variables = {
      TASKS_TABLE_NAME        = var.tasks_table_name
      UPDATES_TABLE_NAME      = var.updates_table_name
      NOTIFICATIONS_TABLE_NAME = var.notifications_table_name
      ENV                     = var.env
    }
  }
}

resource "aws_lambda_function" "update_task_status" {
  function_name = "${var.app_name}-${var.env}-update-task-status"
  role          = aws_iam_role.lambda_role.arn
  handler       = "com.taskbuddy.tasks.UpdateTaskStatusHandler"
  runtime       = "java11"
  timeout       = 30
  memory_size   = 512
  
  filename      = "${path.module}/dummy.zip"
  
  environment {
    variables = {
      TASKS_TABLE_NAME        = var.tasks_table_name
      UPDATES_TABLE_NAME      = var.updates_table_name
      NOTIFICATIONS_TABLE_NAME = var.notifications_table_name
      ENV                     = var.env
    }
  }
}

resource "aws_lambda_function" "get_task_details" {
  function_name = "${var.app_name}-${var.env}-get-task-details"
  role          = aws_iam_role.lambda_role.arn
  handler       = "com.taskbuddy.tasks.GetTaskDetailsHandler"
  runtime       = "java11"
  timeout       = 30
  memory_size   = 512
  
  filename      = "${path.module}/dummy.zip"
  
  environment {
    variables = {
      TASKS_TABLE_NAME   = var.tasks_table_name
      UPDATES_TABLE_NAME = var.updates_table_name
      ENV                = var.env
    }
  }
}

resource "aws_lambda_function" "list_tasks" {
  function_name = "${var.app_name}-${var.env}-list-tasks"
  role          = aws_iam_role.lambda_role.arn
  handler       = "com.taskbuddy.tasks.ListTasksHandler"
  runtime       = "java11"
  timeout       = 30
  memory_size   = 512
  
  filename      = "${path.module}/dummy.zip"
  
  environment {
    variables = {
      TASKS_TABLE_NAME = var.tasks_table_name
      ENV              = var.env
    }
  }
}

# File Management Lambda Functions
resource "aws_lambda_function" "generate_upload_url" {
  function_name = "${var.app_name}-${var.env}-generate-upload-url"
  role          = aws_iam_role.lambda_role.arn
  handler       = "com.taskbuddy.files.GenerateUploadUrlHandler"
  runtime       = "java11"
  timeout       = 30
  memory_size   = 512
  
  filename      = "${path.module}/dummy.zip"
  
  environment {
    variables = {
      ATTACHMENTS_BUCKET_NAME = var.attachments_bucket_name
      ENV                     = var.env
    }
  }
}

resource "aws_lambda_function" "get_download_url" {
  function_name = "${var.app_name}-${var.env}-get-download-url"
  role          = aws_iam_role.lambda_role.arn
  handler       = "com.taskbuddy.files.GetDownloadUrlHandler"
  runtime       = "java11"
  timeout       = 30
  memory_size   = 512
  
  filename      = "${path.module}/dummy.zip"
  
  environment {
    variables = {
      ATTACHMENTS_BUCKET_NAME = var.attachments_bucket_name
      ENV                     = var.env
    }
  }
}

# Notification Lambda Functions
resource "aws_lambda_function" "send_task_notification" {
  function_name = "${var.app_name}-${var.env}-send-task-notification"
  role          = aws_iam_role.lambda_role.arn
  handler       = "com.taskbuddy.notifications.SendTaskNotificationHandler"
  runtime       = "java11"
  timeout       = 30
  memory_size   = 512
  
  filename      = "${path.module}/dummy.zip"
  
  environment {
    variables = {
      NOTIFICATIONS_TABLE_NAME = var.notifications_table_name
      ENV                      = var.env
    }
  }
}

resource "aws_lambda_function" "schedule_deadline_reminder" {
  function_name = "${var.app_name}-${var.env}-schedule-deadline-reminder"
  role          = aws_iam_role.lambda_role.arn
  handler       = "com.taskbuddy.notifications.ScheduleDeadlineReminderHandler"
  runtime       = "java11"
  timeout       = 30
  memory_size   = 512
  
  filename      = "${path.module}/dummy.zip"
  
  environment {
    variables = {
      NOTIFICATIONS_TABLE_NAME = var.notifications_table_name
      ENV                      = var.env
    }
  }
}

# Create a dummy zip file for Lambda deployment
resource "local_file" "dummy_file" {
  content  = "dummy content"
  filename = "${path.module}/dummy.txt"
}

data "archive_file" "dummy_zip" {
  type        = "zip"
  output_path = "${path.module}/dummy.zip"
  source {
    content  = "dummy content"
    filename = "dummy.txt"
  }
  depends_on = [local_file.dummy_file]
}