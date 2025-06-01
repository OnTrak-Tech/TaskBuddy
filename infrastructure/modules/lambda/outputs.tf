output "function_arns" {
  description = "Map of Lambda function ARNs"
  value = {
    admin_create_user      = aws_lambda_function.admin_create_user.arn
    get_user_profile       = aws_lambda_function.get_user_profile.arn
    update_user_profile    = aws_lambda_function.update_user_profile.arn
    list_users             = aws_lambda_function.list_users.arn
    create_task            = aws_lambda_function.create_task.arn
    assign_task            = aws_lambda_function.assign_task.arn
    update_task_status     = aws_lambda_function.update_task_status.arn
    get_task_details       = aws_lambda_function.get_task_details.arn
    list_tasks             = aws_lambda_function.list_tasks.arn
    generate_upload_url    = aws_lambda_function.generate_upload_url.arn
    get_download_url       = aws_lambda_function.get_download_url.arn
    send_task_notification = aws_lambda_function.send_task_notification.arn
    schedule_deadline_reminder = aws_lambda_function.schedule_deadline_reminder.arn
  }
}

output "lambda_role_arn" {
  description = "Lambda IAM role ARN"
  value       = aws_iam_role.lambda_role.arn
}