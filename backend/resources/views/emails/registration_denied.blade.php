<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Update</title>
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
            background: linear-gradient(135deg, #475569 0%, #1e293b 100%);
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
        .reason-box {
            background-color: #fff1f2;
            border-left: 4px solid #e11d48;
            padding: 16px 20px;
            border-radius: 0 8px 8px 0;
            margin: 20px 0;
        }
        .reason-title {
            font-size: 13px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #9f1239;
            margin-bottom: 6px;
        }
        .reason-text {
            font-size: 14px;
            color: #881337;
            margin: 0;
        }
        .help-box {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 16px 20px;
            font-size: 13px;
            color: #475569;
            margin-top: 24px;
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
            <span class="badge">Application Denied</span>
        </div>
        <div class="content">
            <div class="greeting">Dear {{ $registration->first_name }},</div>
            <p>
                Thank you for submitting your student registration request for 
                <strong>{{ $registration->program }}</strong> (Reference: <code>{{ $registration->reference_no }}</code>).
            </p>
            <p>
                Following evaluation by the school admissions administration, we regret to inform you that your registration application could not be approved at this time.
            </p>

            <div class="reason-box">
                <div class="reason-title">Reason for Decision:</div>
                <p class="reason-text">
                    {{ $reason ?? 'Your application did not meet the enrollment requirements or requires credential verification with the Registrar office.' }}
                </p>
            </div>

            <div class="help-box">
                <strong>Need Assistance or Wish to Appeal?</strong><br>
                Please contact the ABC School Admissions &amp; Registrar Office directly at 
                <a href="mailto:admissions@abcschool.edu" style="color: #80172B; font-weight: 600;">admissions@abcschool.edu</a> 
                or visit the Registrar's window during official campus hours (Mon–Fri, 8:00 AM – 5:00 PM). Please cite your reference number <strong>{{ $registration->reference_no }}</strong>.
            </div>
        </div>
        <div class="footer">
            &copy; 2026 ABC School. All rights reserved.<br>
            Office of the Registrar &amp; Student Affairs
        </div>
    </div>
</body>
</html>
