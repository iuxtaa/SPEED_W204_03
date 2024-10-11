import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private oauth2Client: any;

  constructor(private configService: ConfigService) {
    // Initialize the OAuth2 client
    this.oauth2Client = new google.auth.OAuth2(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
      this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
      'https://developers.google.com/oauthplayground' // Redirect URL
    );

    // Set the refresh token
    this.oauth2Client.setCredentials({
      refresh_token: this.configService.get<string>('GOOGLE_REFRESH_TOKEN'),
    });

    // Initialize the transporter
    this.initializeTransporter();
  }

  private initializeTransporter() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: this.configService.get<string>('SENDER_EMAIL'),
        pass: this.configService.get<string>('SENDER_PASSWORD'),
        clientId: this.configService.get<string>('GOOGLE_CLIENT_ID'),
        clientSecret: this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
        refreshToken: this.configService.get<string>('GOOGLE_REFRESH_TOKEN'),
      },
    });
  }

  async getAccessToken() {
    const accessToken = await this.oauth2Client.getAccessToken();
    return accessToken?.token;
  }

  async sendRejectionEmail(recipientEmail: string, articleTitle: string, feedback: string) {
    const mailOptions = {
      from: `"SPEED" <${this.configService.get<string>('SENDER_EMAIL')}>`,
      to: recipientEmail,
      subject: `Article Rejected: ${articleTitle}`,
      text: `Dear author,\n\nYour article "${articleTitle}" has been rejected.\nFeedback: ${feedback}\n\nBest regards,\nSPEED Team`,
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent', result);
    } catch (error) {
      console.error('Error sending email', error);
    }
  }

  async sendAcceptanceEmail(recipientEmail: string, articleTitle: string) {
    const mailOptions = {
      from: `"SPEED" <${this.configService.get<string>('SENDER_EMAIL')}>`,
      to: recipientEmail,
      subject: `Article Moderated: ${articleTitle}`,
      text: `Dear author,\n\nYour article "${articleTitle}" has been moderated and will move onto analysis.\n\nBest regards,\nSPEED Team`,
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent', result);
    } catch (error) {
      console.error('Error sending email', error);
    }
  }

  async notifyAnalyst(articleID: string, articleTitle: string) {
    const mailOptions = {
      from: `"SPEED" <${this.configService.get<string>('SENDER_EMAIL')}>`,
      to: `${this.configService.get<string>('ANALYST_EMAIL')}`,
      subject: `New Article submitted for Analysis, ID: ${articleID} ${articleTitle}`,
      text: `Dear analyst,\n\nNew article "${articleTitle}" with ID "${articleID}" has been submitted for analysis.\n\nBest regards,\nSPEED Team`,
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent', result);
    } catch (error) {
      console.error('Error sending email', error);
    }
  }
}
