import { Injectable } from "@nestjs/common";

@Injectable()
export class NotificationService {
  async notifySubmitter(email: string, message: string) {
    // Logic to send an email to the submitter
    await this.sendEmail(email, 'Article Status Update', message);
  }

  async notifyAnalyst(articleId: string) {
    const message = `Article with ID ${articleId} is ready for analysis.`;
    const analystEmail = 'anngabrielledelrosario@gmail.com';  // Assume this is fetched dynamically

    await this.sendEmail(analystEmail, 'New Article for Analysis', message);
  }

  async sendEmail(to: string, subject: string, text: string) {
    // Example implementation using nodemailer or another email service
    console.log(`Sending email to ${to}: ${subject} - ${text}`);
    // Actual email sending code goes here...
  }
}
