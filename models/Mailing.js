export const mailOptions = function mail(verificationCode, email) { 
    return {
    from: "verify@resumaker.org",
        to: email,
        subject: "Verification Code",
        text: `Here is your one time verification code for resumaker.org:\n ${ verificationCode }`,
        html: `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verification Code</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #121212;
                    margin: 0;
                    padding: 0;
                    color: #e0e0e0;
                }
                .container {
                    max-width: 600px;
                    margin: 50px auto;
                    background: #1e1e1e;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
                    text-align: center;
                }
                .logo {
                    max-width: 150px;
                    margin-bottom: 20px;
                }
                h2 {
                    color: #ffffff;
                }
                .code {
                    font-size: 24px;
                    font-weight: bold;
                    background: #2d2d2d;
                    color: #ffffff;
                    display: inline-block;
                    padding: 10px 20px;
                    margin: 20px 0;
                    border-radius: 5px;
                    border: 1px solid #3d3d3d;
                }
                .footer {
                    margin-top: 20px;
                    font-size: 12px;
                    color: #888888;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <img src="https://www.resumaker.org/assets/Resumaker-C7UD-W2K.png" alt="Logo" class="logo">
                <h2>Your Verification Code</h2>
                <p>Use the following code to verify your account:</p>
                <div class="code">${verificationCode}</div>
                <p>If you did not request this code, please ignore this email.</p>
                <div class="footer">&copy; 2025 Resumaker. All rights reserved.</div>
            </div>
        </body>
        </html>`
}};