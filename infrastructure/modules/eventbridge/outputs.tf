output "deadline_checker_rule_arn" {
  description = "Deadline checker EventBridge rule ARN"
  value       = aws_cloudwatch_event_rule.deadline_checker.arn
}

output "overdue_task_processor_rule_arn" {
  description = "Overdue task processor EventBridge rule ARN"
  value       = aws_cloudwatch_event_rule.overdue_task_processor.arn
}