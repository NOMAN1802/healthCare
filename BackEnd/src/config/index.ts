import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwt: {
    jwt_secret: process.env.JWT_SECRET,
    expires_in: process.env.EXPIRES_IN,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
    reset_pass_secret: process.env.RESET_PASS_TOKEN_SECRET,
    reset_pass_expires_in: process.env.RESET_PASS_TOKEN_EXPIRES_IN,
  },
  emailSender: {
    email: process.env.SENDER_EMAIL,
    email_sender_pass: process.env.SENDER_APP_PASS,
  },
  ssl: {
    storeId: process.env.SSL_STORE_ID,
    storePass: process.env.SSL_STORE_PASSWORD,
    successUrl: process.env.SSL_SUCCESS_URL,
    cancelUrl: process.env.SSL_CANCEL_URL,
    failUrl: process.env.SSL_FAIL_URL,
    sslPaymentApi: process.env.SSL_PAYMENT_URL,
    sslValidationApi: process.env.SSL_VALIDATION_URL,
  },
  frontendUrl: process.env.FRONTEND_URL,
  reset_link: process.env.RESET_LINK,
};
