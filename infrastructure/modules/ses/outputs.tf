output "task_assignment_template_name" {
  description = "Task assignment email template name"
  value       = aws_ses_template.task_assignment.name
}

output "deadline_reminder_template_name" {
  description = "Deadline reminder email template name"
  value       = aws_ses_template.deadline_reminder.name
}

output "task_status_update_template_name" {
  description = "Task status update email template name"
  value       = aws_ses_template.task_status_update.name
}