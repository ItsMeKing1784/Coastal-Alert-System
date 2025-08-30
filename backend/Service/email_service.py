import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

class EmailService:
    def __init__(self, smtp_server, smtp_port, smtp_user, smtp_password):
        self.smtp_server = smtp_server
        self.smtp_port = smtp_port
        self.smtp_user = smtp_user
        self.smtp_password = smtp_password

    def send_email(self, to_email, subject, recipient_name, alert_message, action_url=None):
        try:
            msg = MIMEMultipart()
            msg['From'] = self.smtp_user
            msg['To'] = to_email
            msg['Subject'] = subject

            html_template = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Coastal Alert Notification</title>
                <style>
                    body {{
                        font-family: 'Helvetica Neue', Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        background-color: #f5f7fa;
                        color: #333;
                    }}
                    .email-wrapper {{
                        width: 100%;
                        padding: 40px 0;
                        background-color: #f5f7fa;
                    }}
                    .email-container {{
                        max-width: 620px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        border-radius: 15px;
                        overflow: hidden;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                        border-top: 6px solid #0288d1;
                    }}
                    .header {{
                        background-color: #0288d1;
                        color: #ffffff;
                        text-align: center;
                        padding: 30px 20px;
                    }}
                    .header h1 {{
                        margin: 0;
                        font-size: 28px;
                        letter-spacing: 1px;
                    }}
                    .content {{
                        padding: 30px 25px;
                        line-height: 1.8;
                    }}
                    .content p {{
                        font-size: 16px;
                        margin: 15px 0;
                    }}
                    .alert-box {{
                        background-color: #fff3e0;
                        border-left: 6px solid #fb8c00;
                        padding: 18px 22px;
                        margin: 20px 0;
                        border-radius: 10px;
                        font-weight: bold;
                        color: #e65100;
                    }}
                    .button {{
                        display: inline-block;
                        margin-top: 20px;
                        padding: 14px 30px;
                        background-color: #0288d1;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 10px;
                        font-weight: 600;
                        transition: background 0.3s;
                    }}
                    .button:hover {{
                        background-color: #0277bd;
                    }}
                    .footer {{
                        text-align: center;
                        font-size: 13px;
                        color: #777;
                        padding: 20px;
                        background-color: #f0f0f0;
                        line-height: 1.5;
                    }}
                    @media screen and (max-width: 640px) {{
                        .email-container {{
                            margin: 0 15px;
                        }}
                        .content {{
                            padding: 20px 15px;
                        }}
                        .header h1 {{
                            font-size: 24px;
                        }}
                    }}
                </style>
            </head>
            <body>
                <div class="email-wrapper">
                    <div class="email-container">
                        <div class="header">
                            <h1>Coastal Alert System</h1>
                        </div>
                        <div class="content">
                            <p>Hello {recipient_name},</p>
                            <p>We have an important coastal alert for your area:</p>
                            <div class="alert-box">{alert_message}</div>
                            {f'<a href="{action_url}" class="button">View Full Alert</a>' if action_url else ''}
                            <p>Please follow the recommended safety guidelines and stay updated with local authorities.</p>
                            <p>For your safety:</p>
                            <ul>
                                <li>Stay indoors if advised.</li>
                                <li>Avoid coastal areas during severe alerts.</li>
                                <li>Keep emergency contact numbers handy.</li>
                            </ul>
                            <p>Thank you for using the Coastal Alert System.</p>
                        </div>
                        <div class="footer">
                            &copy; 2025 Coastal Alert System. All rights reserved.<br>
                            This is an automated notification. Please do not reply.<br>
                            For assistance, visit our <a href="https://coastalalertsystem.example.com" target="_blank">help center</a>.
                        </div>
                    </div>
                </div>
            </body>
            </html>
            """

            msg.attach(MIMEText(html_template, 'html'))

            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_password)
                server.sendmail(self.smtp_user, to_email, msg.as_string())

            return True, "Email sent successfully."
        except Exception as e:
            return False, str(e)



