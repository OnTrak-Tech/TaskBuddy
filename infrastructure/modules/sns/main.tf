resource "aws_sns_topic" "task_notifications" {
  name = "${var.app_name}-${var.env}-task-notifications"
  
  tags = {
    Name        = "${var.app_name}-${var.env}-task-notifications"
    Environment = var.env
  }
}

resource "aws_sns_topic" "deadline_reminders" {
  name = "${var.app_name}-${var.env}-deadline-reminders"
  
  tags = {
    Name        = "${var.app_name}-${var.env}-deadline-reminders"
    Environment = var.env
  }
}

resource "aws_sns_topic_policy" "task_notifications_policy" {
  arn = aws_sns_topic.task_notifications.arn

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = "*",
        Action = "SNS:Publish",
        Resource = aws_sns_topic.task_notifications.arn  # ✅ Exactly one ARN
      }
    ]
  })
}


resource "aws_sns_topic_policy" "deadline_reminders_policy" {
  arn = aws_sns_topic.deadline_reminders.arn

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = "*",
        Action = "SNS:Publish",
        Resource = aws_sns_topic.deadline_reminders.arn  # ✅ Exactly one ARN
      }
    ]
  })
}


data "aws_iam_policy_document" "sns_topic_policy" {
  statement {
    actions = [
      "SNS:Subscribe",
      "SNS:SetTopicAttributes",
      "SNS:RemovePermission",
      "SNS:Receive",
      "SNS:Publish",
      "SNS:ListSubscriptionsByTopic",
      "SNS:GetTopicAttributes",
      "SNS:DeleteTopic",
      "SNS:AddPermission",
    ]

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceOwner"

      values = [
        data.aws_caller_identity.current.account_id,
      ]
    }

    effect = "Allow"

    principals {
      type        = "AWS"
      identifiers = ["*"]
    }

    resources = [
      aws_sns_topic.task_notifications.arn,
      aws_sns_topic.deadline_reminders.arn,
    ]
  }
}

data "aws_caller_identity" "current" {}