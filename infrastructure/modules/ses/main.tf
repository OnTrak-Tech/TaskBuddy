resource "aws_ses_email_identity" "admin" {
  email = "admin@${var.app_name}.com"
}

resource "aws_ses_template" "task_assignment" {
  name    = "${var.app_name}-${var.env}-task-assignment"
  subject = "New Task Assigned: {{taskTitle}}"
  html    = <<EOF
<h2>New Task Assigned: {{taskTitle}}</h2>
<p>Priority: {{priority}}</p>
<p>Due Date: {{dueDate}}</p>
<p>Description: {{description}}</p>
<a href="{{taskLink}}">View Task</a>
EOF
  text    = <<EOF
New Task Assigned: {{taskTitle}}
Priority: {{priority}}
Due Date: {{dueDate}}
Description: {{description}}
View Task: {{taskLink}}
EOF
}

resource "aws_ses_template" "deadline_reminder" {
  name    = "${var.app_name}-${var.env}-deadline-reminder"
  subject = "Deadline Reminder: {{taskTitle}}"
  html    = <<EOF
<h2>Deadline Reminder: {{taskTitle}}</h2>
<p>Due in {{timeRemaining}}</p>
<a href="{{taskLink}}">Complete Task</a>
EOF
  text    = <<EOF
Deadline Reminder: {{taskTitle}}
Due in {{timeRemaining}}
Complete Task: {{taskLink}}
EOF
}

resource "aws_ses_template" "task_status_update" {
  name    = "${var.app_name}-${var.env}-task-status-update"
  subject = "Task Status Update: {{taskTitle}}"
  html    = <<EOF
<h2>Task Status Update: {{taskTitle}}</h2>
<p>Status changed from {{oldStatus}} to {{newStatus}}</p>
<p>Updated by: {{updatedBy}}</p>
<p>Comments: {{comments}}</p>
<a href="{{taskLink}}">View Task</a>
EOF
  text    = <<EOF
Task Status Update: {{taskTitle}}
Status changed from {{oldStatus}} to {{newStatus}}
Updated by: {{updatedBy}}
Comments: {{comments}}
View Task: {{taskLink}}
EOF
}