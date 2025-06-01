output "api_id" {
  description = "API Gateway ID"
  value       = aws_api_gateway_rest_api.main.id
}

output "api_url" {
  description = "API Gateway URL"
  value       = "${aws_api_gateway_deployment.main.invoke_url}"
}