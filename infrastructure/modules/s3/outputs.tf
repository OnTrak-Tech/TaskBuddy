output "attachments_bucket_name" {
  description = "Attachments bucket name"
  value       = aws_s3_bucket.attachments.id
}

output "attachments_bucket_arn" {
  description = "Attachments bucket ARN"
  value       = aws_s3_bucket.attachments.arn
}