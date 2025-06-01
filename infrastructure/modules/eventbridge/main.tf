resource "aws_cloudwatch_event_rule" "deadline_checker" {
  name                = "${var.app_name}-${var.env}-deadline-checker"
  description         = "Check for approaching deadlines"
  schedule_expression = "rate(1 hour)"
}

resource "aws_cloudwatch_event_target" "deadline_checker_lambda" {
  rule      = aws_cloudwatch_event_rule.deadline_checker.name
  target_id = "DeadlineCheckerLambda"
  arn       = var.lambda_functions["schedule_deadline_reminder"]
}

resource "aws_lambda_permission" "allow_eventbridge_deadline_checker" {
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_functions["schedule_deadline_reminder"]
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.deadline_checker.arn
}

resource "aws_cloudwatch_event_rule" "overdue_task_processor" {
  name                = "${var.app_name}-${var.env}-overdue-task-processor"
  description         = "Process overdue tasks"
  schedule_expression = "cron(0 0 * * ? *)" # Run daily at midnight
}

resource "aws_cloudwatch_event_target" "overdue_task_processor_lambda" {
  rule      = aws_cloudwatch_event_rule.overdue_task_processor.name
  target_id = "OverdueTaskProcessorLambda"
  arn       = var.lambda_functions["update_task_status"]
  
  input = jsonencode({
    action = "process_overdue_tasks"
  })
}

resource "aws_lambda_permission" "allow_eventbridge_overdue_task_processor" {
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_functions["update_task_status"]
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.overdue_task_processor.arn
}