<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Approved</title>
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
            background-color: #ecfdf5;
            color: #065f46;
            border: 1px solid #a7f3d0;
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
        .credentials-box {
            background-color: #f8fafc;
            border: 2px dashed #cbd5e1;
            border-radius: 12px;
            padding: 20px 24px;
            margin: 24px 0;
        }
        .credentials-title {
            font-size: 13px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #64748b;
            margin-bottom: 12px;
        }
        .credential-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        .credential-row:last-child {
            border-bottom: none;
        }
        .credential-label {
            font-size: 13px;
            color: #64748b;
            font-weight: 600;
        }
        .credential-val {
            font-size: 15px;
            font-family: monospace;
            font-weight: 700;
            color: #0f172a;
            background-color: #e2e8f0;
            padding: 3px 8px;
            border-radius: 6px;
        }
        .cta-btn {
            display: block;
            background-color: #80172B;
            color: #ffffff !important;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 10px;
            font-weight: 700;
            font-size: 15px;
            text-align: center;
            margin: 28px 0 16px;
        }
        .note-box {
            background-color: #eff6ff;
            border-left: 4px solid #3b82f6;
            padding: 12px 16px;
            border-radius: 0 8px 8px 0;
            font-size: 13px;
            color: #1e40af;
            margin-top: 16px;
        }
        .footer {
            background-color: #f8fafc;
            border-top: 1px solid #e2e8f0;
            padding: 20px 24px;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>ABC School Student Portal</h1>
            <p>Official Admissions &amp; Enrollment Notification</p>
            <span class="badge">Application Approved</span>
        </div>
        <div class="content">
            <div class="greeting">Hello, {{ $registration->first_name }}!</div>
            <p>
                Congratulations! Your student registration application for 
                <strong>{{ $registration->program }}</strong> (Reference: <code>{{ $registration->reference_no }}</code>) 
                has been approved by the school administration.
            </p>
            <p>
                Your official student account has been created. Please use the following credentials to access the ABC School Student Portal:
            </p>

            <div class="credentials-box">
                <div class="credentials-title">Your Portal Credentials</div>
                <div class="credential-row">
                    <span class="credential-label">Username:</span>
                    <span class="credential-val">{{ $username }}</span>
                </div>
                <div class="credential-row">
                    <span class="credential-label">Temporary Password:</span>
                    <span class="credential-val">{{ $temporaryPassword }}</span>
                </div>
            </div>

            <div class="note-box">
                <strong>Important Security Requirement:</strong> For your security, you will be prompted to set your own permanent password immediately upon your first login.
            </div>

            <a href="{{ $loginUrl }}" class="cta-btn">Log In to Student Portal</a>

            <p style="font-size: 13px; color: #64748b; text-align: center;">
                If the button above does not work, copy and paste this link into your browser:<br>
                <a href="{{ $loginUrl }}" style="color: #80172B;">{{ $loginUrl }}</a>
            </p>
        </div>
        <div class="footer">
            &copy; 2026 ABC School. All rights reserved.<br>
            Office of the Registrar &amp; Student Affairs
        </div>
    </div>
</body>
</html>
