import { STATUS_STAGES, VALID_TRANSITIONS, COLLECTIONS } from '../config/constants.js';
import { getFirestore } from '../config/firebase.js';
import { logger } from '../utils/logger.js';
import notificationService from './notificationService.js';
import auditService from './auditService.js';

class StatusService {
  constructor() {
    this.db = getFirestore();
  }

  /**
   * Validate status transition
   */
  validateTransition(currentStatus, newStatus) {
    const allowedTransitions = VALID_TRANSITIONS[currentStatus] || [];
    
    if (!allowedTransitions.includes(newStatus)) {
      throw new Error(
        `Invalid status transition from ${currentStatus} to ${newStatus}. ` +
        `Allowed transitions: ${allowedTransitions.join(', ')}`
      );
    }
    
    return true;
  }

  /**
   * Update donation status with workflow validation
   */
  async updateDonationStatus(donationId, newStatus, volunteerId, additionalData = {}) {
    try {
      const donationRef = this.db.collection(COLLECTIONS.DONATIONS).doc(donationId);
      const donationDoc = await donationRef.get();
      
      if (!donationDoc.exists) {
        throw new Error('Donation not found');
      }
      
      const donation = donationDoc.data();
      const currentStatus = donation.status;
      
      // Validate transition
      this.validateTransition(currentStatus, newStatus);
      
      // Prepare update data
      const updateData = {
        status: newStatus,
        updatedAt: new Date(),
        ...additionalData
      };
      
      // Add volunteer assignment for accepted status
      if (newStatus === STATUS_STAGES.ACCEPTED && volunteerId) {
        updateData.assignedTo = volunteerId;
        updateData.acceptedAt = new Date();
      }
      
      // Add timestamps for other stages
      if (newStatus === STATUS_STAGES.PICKED) {
        updateData.pickedAt = new Date();
      } else if (newStatus === STATUS_STAGES.DELIVERED) {
        updateData.deliveredAt = new Date();
      }
      
      // Update donation
      await donationRef.update(updateData);
      
      // Log the status change
      await auditService.logStatusChange(
        donationId,
        'donation',
        currentStatus,
        newStatus,
        volunteerId,
        additionalData
      );
      
      // Send notifications
      await this.sendStatusNotifications(donationId, newStatus, donation, volunteerId);
      
      logger.info(`Donation ${donationId} status updated: ${currentStatus} → ${newStatus}`);
      
      return { success: true, newStatus, previousStatus: currentStatus };
    } catch (error) {
      logger.error('Error updating donation status:', error);
      throw error;
    }
  }

  /**
   * Update request status
   */
  async updateRequestStatus(requestId, newStatus, volunteerId, additionalData = {}) {
    try {
      const requestRef = this.db.collection(COLLECTIONS.REQUESTS).doc(requestId);
      const requestDoc = await requestRef.get();
      
      if (!requestDoc.exists) {
        throw new Error('Request not found');
      }
      
      const request = requestDoc.data();
      const currentStatus = request.status;
      
      // Validate transition
      this.validateTransition(currentStatus, newStatus);
      
      // Prepare update data
      const updateData = {
        status: newStatus,
        updatedAt: new Date(),
        ...additionalData
      };
      
      if (newStatus === STATUS_STAGES.ACCEPTED && volunteerId) {
        updateData.assignedTo = volunteerId;
        updateData.acceptedAt = new Date();
      }
      
      // Update request
      await requestRef.update(updateData);
      
      // Log the status change
      await auditService.logStatusChange(
        requestId,
        'request',
        currentStatus,
        newStatus,
        volunteerId,
        additionalData
      );
      
      // Send notifications
      await this.sendStatusNotifications(requestId, newStatus, request, volunteerId);
      
      logger.info(`Request ${requestId} status updated: ${currentStatus} → ${newStatus}`);
      
      return { success: true, newStatus, previousStatus: currentStatus };
    } catch (error) {
      logger.error('Error updating request status:', error);
      throw error;
    }
  }

  /**
   * Send notifications based on status change
   */
  async sendStatusNotifications(itemId, newStatus, itemData, volunteerId) {
    try {
      switch (newStatus) {
        case STATUS_STAGES.ACCEPTED:
          await notificationService.sendDonationAcceptedNotification(itemData, volunteerId);
          break;
        case STATUS_STAGES.PICKED:
          await notificationService.sendDonationPickedNotification(itemData, volunteerId);
          break;
        case STATUS_STAGES.DELIVERED:
          await notificationService.sendDonationDeliveredNotification(itemData, volunteerId);
          break;
      }
    } catch (error) {
      logger.error('Error sending status notifications:', error);
      // Don't throw error here to avoid breaking the status update
    }
  }

  /**
   * Get status history for an item
   */
  async getStatusHistory(itemId, itemType) {
    try {
      const auditSnapshot = await this.db.collection(COLLECTIONS.AUDIT_LOGS)
        .where('itemId', '==', itemId)
        .where('itemType', '==', itemType)
        .orderBy('timestamp', 'asc')
        .get();
      
      return auditSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      logger.error('Error getting status history:', error);
      throw error;
    }
  }

  /**
   * Get items by status and location
   */
  async getItemsByStatus(status, location, itemType = 'donation') {
    try {
      const collection = itemType === 'donation' ? COLLECTIONS.DONATIONS : COLLECTIONS.REQUESTS;
      
      let query = this.db.collection(collection).where('status', '==', status);
      
      if (location) {
        query = query.where('location_lowercase', '==', location.toLowerCase());
      }
      
      const snapshot = await query.orderBy('createdAt', 'desc').get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      logger.error('Error getting items by status:', error);
      throw error;
    }
  }
}

export default new StatusService();