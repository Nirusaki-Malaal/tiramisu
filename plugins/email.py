import smtplib, random
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

html ="""
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Shingaku Verification</title>
</head>

<body style="
  margin:0;
  padding:0;
  background:#050505;
  font-family: 'Segoe UI', Arial, sans-serif;
">

  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:50px 12px;">

        <table width="420" cellpadding="0" cellspacing="0" style="
          background:linear-gradient(180deg, #0b0b0b, #121212);
          border-radius:14px;
          box-shadow:0 0 40px rgba(255,120,0,0.25);
        ">

          <tr>
            <td style="padding:34px; text-align:center; color:#ffffff;">

              <!-- LOGO / TITLE -->
              <h1 style="
                margin:0;
                font-size:30px;
                letter-spacing:4px;
                font-weight:700;
              ">
                SHINGAKU
              </h1>

              <p style="
                margin:6px 0 30px;
                font-size:13px;
                letter-spacing:2px;
                color:#ff8c00;
              ">
                進学 • AUTHORIZATION REQUIRED
              </p>

              <!-- MESSAGE -->
              <p style="
                font-size:15px;
                color:#cccccc;
                line-height:1.6;
                margin-bottom:24px;
              ">
                A disturbance has been detected at the gate.<br>
                Prove your intent to proceed.
              </p>

              <!-- OTP BOX -->
              <div style="
                margin:26px auto;
                padding:20px 0;
                width:100%;
                border:1px solid #ff8c00;
                border-radius:12px;
                font-size:36px;
                letter-spacing:8px;
                font-weight:700;
                color:#ff8c00;
                background:rgba(255,140,0,0.05);
              ">
                {OTP}
              </div>

              <!-- FOOTER -->
              <p style="
                font-size:13px;
                color:#aaaaaa;
                margin-top:26px;
              ">
                This code fades in <strong>5 minutes</strong>.
              </p>

              <p style="
                font-size:12px;
                color:#666666;
                margin-top:24px;
                line-height:1.5;
              ">
                If you did not initiate this request,<br>
                remain still — the gate will stay sealed.
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>

"""

def send_email(EMAIL, APP_PASSWORD, receiver_email):
    msg = MIMEMultipart()
    msg["From"] = EMAIL
    msg["To"] = receiver_email
    msg["Subject"] = "OTP Verification By Shingaku"
    otp = random.randint(100000, 999999)
    msg.attach(MIMEText(html.format(OTP=otp), "html"))
    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.starttls()
    server.login(EMAIL, APP_PASSWORD)
    server.send_message(msg)
    server.quit()
    print("Email sent ✅")
    return otp




    