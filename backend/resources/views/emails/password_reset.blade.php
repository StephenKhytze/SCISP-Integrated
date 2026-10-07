<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Request</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f1f5f9;
            color: #1e293b;
            margin: 0;
            padding: 24px;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08);
            border: 1px solid #e2e8f0;
        }
        .header {
            background: linear-gradient(135deg, #80172B 0%, #4a0c18 100%);
            padding: 32px 24px;
            text-align: center;
            color: #ffffff;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.5px;
        }
        .header p {
            margin: 8px 0 0;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.9);
        }
        .badge {
            display: inline-block;
            background-color: #fef2f2;
            color: #991b1b;
            border: 1px solid #fecaca;
            padding: 6px 14px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 700;
            margin-top: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .content {
            padding: 32px 28px;
        }
        .greeting {
            font-size: 18px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 12px;
        }
        .lead-text {
            font-size: 14px;
            color: #475569;
            margin-bottom: 20px;
        }
        .otp-box {
            background: linear-gradient(135deg, #182848 0%, #0f172a 100%);
            border-radius: 14px;
            padding: 24px;
            text-align: center;
            margin: 24px 0;
            color: #ffffff;
            box-shadow: 0 4px 12px rgba(24, 40, 72, 0.25);
        }
        .otp-label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            font-weight: 700;
            color: #94a3b8;
            margin-bottom: 8px;
        }
        .otp-code {
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
            font-size: 38px;
            font-weight: 900;
            letter-spacing: 8px;
            color: #ffffff;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
            margin: 4px 0;
        }
        .otp-expiry {
            font-size: 12px;
            color: #cbd5e1;
            margin-top: 8px;
        }
        .divider-container {
            display: flex;
            align-items: center;
            text-align: center;
            margin: 28px 0;
        }
        .divider-line {
            flex-grow: 1;
            border-top: 1px solid #e2e8f0;
        }
        .divider-text {
            padding: 0 12px;
            color: #94a3b8;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
        }
        .button-wrapper {
            text-align: center;
            margin: 24px 0;
        }
        .btn-reset {
            display: inline-block;
            background-color: #80172B;
            color: #ffffff !important;
            padding: 14px 32px;
            font-size: 14px;
            font-weight: 700;
            text-decoration: none;
            border-radius: 9999px;
            box-shadow: 0 4px 14px rgba(128, 23, 43, 0.35);
        }
        .info-card {
            background-color: #f8fafc;
            border-left: 4px solid #80172B;
            padding: 14px 16px;
            border-radius: 8px;
            font-size: 13px;
            color: #475569;
            margin: 20px 0;
        }
        .footer {
            background-color: #f8fafc;
            padding: 24px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
            color: #64748b;
        }
        .footer p {
            margin: 4px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>ABC SCHOOL</h1>
            <p>Student & Academic Portal Security</p>
            <div class="badge">Password Reset Request</div>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="greeting">Hello {{ $user->first_name ?: $user->username }},</div>
            <p class="lead-text">
                We received a request to reset the password for your portal account (<strong>{{ $user->username }}</strong>).
            </p>

            <!-- 6-Digit OTP Box -->
            <div class="otp-box">
                <div class="otp-label">Your 6-Digit Recovery Code</div>
                <div class="otp-code">{{ $code }}</div>
                <div class="otp-expiry">Valid for {{ $expiresInMinutes }} minutes</div>
            </div>

            <p style="font-size: 13px; color: #64748b; text-align: center;">
                Enter this code into the password recovery window to confirm your identity and choose a new password.
            </p>

            <!-- Divider -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
                <tr>
                    <td style="border-top: 1px solid #e2e8f0;"></td>
                    <td style="width: 50px; text-align: center; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">OR</td>
                    <td style="border-top: 1px solid #e2e8f0;"></td>
                </tr>
            </table>

            <!-- Direct Reset Link -->
            <div class="button-wrapper">
                <a href="{{ $resetUrl }}" class="btn-reset" target="_blank">
                    Reset Password Directly &rarr;
                </a>
            </div>

            <!-- Security Warning -->
            <div class="info-card">
                <strong>Security Notice:</strong> If you did not request this password reset, please ignore this email or contact the IT Helpdesk immediately. Your account remains secure.
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>ABC School - Campus Information & Technology Services</strong></p>
            <p>For assistance, contact <a href="mailto:it-helpdesk@abc.edu.ph" style="color: #80172B; text-decoration: underline;">it-helpdesk@abc.edu.ph</a></p>
            <p style="margin-top: 12px; font-size: 11px; color: #94a3b8;">This is an automated security notification. Please do not reply directly to this email.</p>
        </div>
    </div>
</body>
</html>
