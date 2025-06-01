output "users_table_name" {
  description = "Users table name"
  value       = aws_dynamodb_table.users.name
}

output "users_table_arn" {
  description = "Users table ARN"
  value       = aws_dynamodb_table.users.arn
}

output "tasks_table_name" {
  description = "Tasks table name"
  value       = aws_dynamodb_table.tasks.name
}

output "tasks_table_arn" {
  description = "Tasks table ARN"
  value       = aws_dynamodb_table.tasks.arn
}

output "updates_table_name" {
  description = "Task updates table name"
  value       = aws_dynamodb_table.task_updates.name
}

output "updates_table_arn" {
  description = "Task updates table ARN"
  value       = aws_dynamodb_table.task_updates.arn
}

output "notifications_table_name" {
  description = "Notifications table name"
  value       = aws_dynamodb_table.notifications.name
}

output "notifications_table_arn" {
  description = "Notifications table ARN"
  value       = aws_dynamodb_table.notifications.arn
}