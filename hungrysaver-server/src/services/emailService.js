import nodemailer from 'nodemailer';
import { logger } from '../utils/logger.js';

class EmailService {
  constructor() {
    this.transporter = null;
    this.isConfigured = false;
    
    // Only initialize if email credentials are provided
    if (this.hasEmailConfig()) {
      try {
        this.transporter = nodemailer.createTransporter({
          host: process.env.EMAIL_HOST,
          port: parseInt(process.env.EMAIL_PORT) || 587,
          secure: false,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });
        this.isConfigured = true;
        logger.info('Email service configured successfully');
      } catch (error) {
        logger.warn('Email service configuration failed:', error.message);
        this.isConfigured = false;
      }
    } else {
      logger.info('Email service disabled - no credentials provided');
    }
  }

  /**
   * Check if email configuration is available
   */
  hasEmailConfig() {
    return !!(
      process.env.EMAIL_HOST &&
      process.env.EMAIL_PORT &&
      process.env.EMAIL_USER &&
      process.env.EMAIL_PASS
    );
  }

  /**
   * Send email if service is configured, otherwise log the attempt
   */
  async sendEmail(mailOptions) {
    if (!this.isConfigured) {
      logger.info('Email would be sent (service disabled):', {
        to: mailOptions.to,
        subject: mailOptions.subject
      });
      return { messageId: 'disabled' };
    }

    try {
      const result = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully to ${mailOptions.to}`);
      return result;
    } catch (error) {
      logger.error('Error sending email:', error);
      throw error;
    }
  }

  /**
   * Send donation accepted email
   */
  async sendDonationAcceptedEmail(donation, volunteer) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER || 'noreply@hungrysaver.com',
        to: donation.donorEmail || donation.donorContact,
        subject: 'Your Donation Has Been Accepted! 🎉',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #16a34a;">Great News! Your Donation Has Been Accepted</h2>
            
            <p>Dear ${donation.donorName},</p>
            
            <p>We're excited to let you know that your generous donation has been accepted by one of our volunteers!</p>
            
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #0369a1; margin-top: 0;">Donation Details:</h3>
              <ul style="list-style: none; padding: 0;">
                <li><strong>Initiative:</strong> ${donation.initiative.replace('-', ' ')}</li>
                <li><strong>Location:</strong> ${donation.location}</li>
                <li><strong>Volunteer:</strong> ${volunteer.firstName}</li>
                <li><strong>Status:</strong> Accepted - Pickup scheduled</li>
              </ul>
            </div>
            
            <p><strong>What happens next?</strong></p>
            <ol>
              <li>Our volunteer will contact you to arrange pickup</li>
              <li>Your donation will be collected at the scheduled time</li>
              <li>We'll notify you once it's delivered to those in need</li>
            </ol>
            
            <p>Thank you for making a difference in your community! 🙏</p>
            
            <hr style="margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">
              This is an automated message from Hungry Saver Platform.<br>
              If you have any questions, please contact us at support@hungrysaver.com
            </p>
          </div>
        `
      };

      await this.sendEmail(mailOptions);
    } catch (error) {
      logger.error('Error sending donation accepted email:', error);
      // Don't throw error to avoid breaking the main flow
    }
  }

  /**
   * Send donation delivered email
   */
  async sendDonationDeliveredEmail(donation, volunteer, motivationalMessage) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER || 'noreply@hungrysaver.com',
        to: donation.donorEmail || donation.donorContact,
        subject: 'Delivery Complete - You Made a Difference! 🌟',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #16a34a;">Mission Accomplished! 🎉</h2>
            
            <p>Dear ${donation.donorName},</p>
            
            <p>We're thrilled to share that your donation has been successfully delivered!</p>
            
            <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
              <h3 style="color: #15803d; margin-top: 0;">🎯 Impact Summary</h3>
              <p style="font-size: 18px; color: #15803d; font-weight: bold;">${motivationalMessage}</p>
            </div>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #334155; margin-top: 0;">Delivery Details:</h3>
              <ul style="list-style: none; padding: 0;">
                <li><strong>Initiative:</strong> ${donation.initiative.replace('-', ' ')}</li>
                <li><strong>Location:</strong> ${donation.location}</li>
                <li><strong>Delivered by:</strong> ${volunteer.firstName}</li>
                <li><strong>Completed:</strong> ${new Date().toLocaleDateString()}</li>
              </ul>
            </div>
            
            <p>Your kindness has created ripples of hope in the community. Thank you for being part of the solution to hunger and need.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="#" style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Make Another Donation
              </a>
            </div>
            
            <hr style="margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">
              This is an automated message from Hungry Saver Platform.<br>
              If you have any questions, please contact us at support@hungrysaver.com
            </p>
          </div>
        `
      };

      await this.sendEmail(mailOptions);
    } catch (error) {
      logger.error('Error sending donation delivered email:', error);
      // Don't throw error to avoid breaking the main flow
    }
  }

  /**
   * Send volunteer welcome email
   */
  async sendVolunteerWelcomeEmail(volunteer) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER || 'noreply@hungrysaver.com',
        to: volunteer.email,
        subject: 'Welcome to Hungry Saver - You\'re Approved! 🎉',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #16a34a;">Welcome to the Hungry Saver Family! 🎉</h2>
            
            <p>Dear ${volunteer.firstName},</p>
            
            <p>Congratulations! Your volunteer application has been approved. You're now part of our amazing community of changemakers in ${volunteer.location}!</p>
            
            <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #15803d; margin-top: 0;">🌟 What You Can Do Now:</h3>
              <ul>
                <li>Access your volunteer dashboard</li>
                <li>View and accept donation requests in ${volunteer.location}</li>
                <li>Coordinate pickups and deliveries</li>
                <li>Track your impact and help statistics</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="#" style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Access Your Dashboard
              </a>
            </div>
            
            <p>Thank you for choosing to make a difference. Together, we're building a hunger-free community!</p>
            
            <hr style="margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">
              This is an automated message from Hungry Saver Platform.<br>
              If you have any questions, please contact us at support@hungrysaver.com
            </p>
          </div>
        `
      };

      await this.sendEmail(mailOptions);
    } catch (error) {
      logger.error('Error sending volunteer welcome email:', error);
      // Don't throw error to avoid breaking the main flow
    }
  }
}

export default new EmailService();