resource "aws_dynamodb_table" "users" {
  name           = "${var.app_name}-${var.env}-users"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "userId"

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "email"
    type = "S"
  }

  global_secondary_index {
    name               = "EmailIndex"
    hash_key           = "email"
    projection_type    = "ALL"
  }

  tags = {
    Name        = "${var.app_name}-${var.env}-users"
    Environment = var.env
  }
}

resource "aws_dynamodb_table" "tasks" {
  name           = "${var.app_name}-${var.env}-tasks"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "taskId"
  range_key      = "status"

  attribute {
    name = "taskId"
    type = "S"
  }

  attribute {
    name = "status"
    type = "S"
  }

  attribute {
    name = "assignedTo"
    type = "S"
  }

  attribute {
    name = "dueDate"
    type = "S"
  }

  global_secondary_index {
    name               = "AssignedToIndex"
    hash_key           = "assignedTo"
    range_key          = "dueDate"
    projection_type    = "ALL"
  }

  global_secondary_index {
    name               = "StatusIndex"
    hash_key           = "status"
    range_key          = "dueDate"
    projection_type    = "ALL"
  }

  tags = {
    Name        = "${var.app_name}-${var.env}-tasks"
    Environment = var.env
  }
}

resource "aws_dynamodb_table" "task_updates" {
  name           = "${var.app_name}-${var.env}-task-updates"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "taskId"
  range_key      = "timestamp"

  attribute {
    name = "taskId"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "S"
  }

  tags = {
    Name        = "${var.app_name}-${var.env}-task-updates"
    Environment = var.env
  }
}

resource "aws_dynamodb_table" "notifications" {
  name           = "${var.app_name}-${var.env}-notifications"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "notificationId"
  range_key      = "userId"

  attribute {
    name = "notificationId"
    type = "S"
  }

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "createdAt"
    type = "S"
  }

  global_secondary_index {
    name               = "UserNotificationsIndex"
    hash_key           = "userId"
    range_key          = "createdAt"
    projection_type    = "ALL"
  }

  ttl {
    attribute_name = "expiresAt"
    enabled        = true
  }

  tags = {
    Name        = "${var.app_name}-${var.env}-notifications"
    Environment = var.env
  }
}