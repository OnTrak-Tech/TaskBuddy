output "task_notifications_topic_arn" {
  description = "Task notifications SNS topic ARN"
  value       = aws_sns_topic.task_notifications.arn
}

output "deadline_reminders_topic_arn" {
  description = "Deadline reminders SNS topic ARN"
  value       = aws_sns_topic.deadline_reminders.arn
}