resource "aws_cognito_user_pool" "main" {
  name = "${var.app_name}-${var.env}-user-pool"
  
  username_attributes = ["email"]
  
  # Email verification
  email_verification_message = "Your verification code is {####}"
  email_verification_subject = "Your TaskBuddy verification code"
  
  auto_verified_attributes = ["email"]
  
  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }

  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "name"
    required                 = true

    string_attribute_constraints {
      min_length = 1
      max_length = 100
    }
  }

  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "custom:role"
    required                 = false

    string_attribute_constraints {
      min_length = 1
      max_length = 20
    }
  }

  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "custom:phoneNumber"
    required                 = false

    string_attribute_constraints {
      min_length = 1
      max_length = 20
    }
  }

  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "custom:department"
    required                 = false

    string_attribute_constraints {
      min_length = 1
      max_length = 50
    }
  }

  mfa_configuration = "OFF"
  
  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  tags = {
    Name        = "${var.app_name}-${var.env}-user-pool"
    Environment = var.env
  }
}

resource "aws_cognito_user_pool_client" "main" {
  name                = "${var.app_name}-${var.env}-client"
  user_pool_id        = aws_cognito_user_pool.main.id
  
  generate_secret     = false
  refresh_token_validity = 30
  access_token_validity = 1
  id_token_validity = 1
  
  token_validity_units {
    access_token  = "hours"
    id_token      = "hours"
    refresh_token = "days"
  }

  explicit_auth_flows = [
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_PASSWORD_AUTH"
  ]

  callback_urls = ["https://${var.app_name}-${var.env}.amplifyapp.com/auth/callback"]
  logout_urls   = ["https://${var.app_name}-${var.env}.amplifyapp.com/"]
  
  allowed_oauth_flows = ["code", "implicit"]
  allowed_oauth_scopes = ["phone", "email", "openid", "profile"]
  allowed_oauth_flows_user_pool_client = true
  
  supported_identity_providers = ["COGNITO"]
}

resource "aws_cognito_user_group" "admin" {
  name         = "admin"
  user_pool_id = aws_cognito_user_pool.main.id
  description  = "Admin users group"
  precedence   = 1
}

resource "aws_cognito_user_group" "team_member" {
  name         = "team_member"
  user_pool_id = aws_cognito_user_pool.main.id
  description  = "Team member users group"
  precedence   = 2
}