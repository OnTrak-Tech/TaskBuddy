output "app_id" {
  description = "Amplify App ID"
  value       = aws_amplify_app.frontend.id
}

output "app_url" {
  description = "Amplify App URL"
  value       = "https://${aws_amplify_branch.main.branch_name}.${aws_amplify_app.frontend.default_domain}"
}