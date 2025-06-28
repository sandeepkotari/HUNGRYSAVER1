import { getFirestore } from '../config/firebase.js';
import { COLLECTIONS, USER_TYPES } from '../config/constants.js';
import locationService from './locationService.js';
import { logger } from '../utils/logger.js';

class MatchingService {
  constructor() {
    this.db = getFirestore();
  }

  /**
   * Find volunteers by location
   */
  async findVolunteersByLocation(location) {
    try {
      const standardizedLocation = locationService.validateLocation(location);
      
      const volunteersSnapshot = await this.db.collection(COLLECTIONS.USERS)
        .where('userType', '==', USER_TYPES.VOLUNTEER)
        .where('status', '==', 'approved')
        .where('location', '==', standardizedLocation)
        .get();
      
      const volunteers = volunteersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      logger.info(`Found ${volunteers.length} volunteers in ${standardizedLocation}`);
      return volunteers;
    } catch (error) {
      logger.error('Error finding volunteers by location:', error);
      throw error;
    }
  }

  /**
   * Find donors by location
   */
  async findDonorsByLocation(location) {
    try {
      const standardizedLocation = locationService.validateLocation(location);
      
      const donorsSnapshot = await this.db.collection(COLLECTIONS.USERS)
        .where('userType', '==', USER_TYPES.DONOR)
        .where('status', '==', 'approved')
        .get();
      
      // Filter by location if they have location data
      const donors = donorsSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(donor => !donor.location || donor.location === standardizedLocation);
      
      logger.info(`Found ${donors.length} donors for ${standardizedLocation}`);
      return donors;
    } catch (error) {
      logger.error('Error finding donors by location:', error);
      throw error;
    }
  }

  /**
   * Find available volunteers with fallback to nearby cities
   */
  async findAvailableVolunteers(location, radiusKm = 50) {
    try {
      // First, try exact location match
      let volunteers = await this.findVolunteersByLocation(location);
      
      // If no volunteers found, try nearby cities
      if (volunteers.length === 0) {
        const nearbyCities = locationService.findNearbyCities(location, radiusKm);
        
        for (const nearbyCity of nearbyCities) {
          const nearbyVolunteers = await this.findVolunteersByLocation(nearbyCity);
          volunteers = volunteers.concat(nearbyVolunteers);
          
          if (volunteers.length > 0) {
            logger.info(`Found volunteers in nearby city: ${nearbyCity}`);
            break;
          }
        }
      }
      
      return volunteers;
    } catch (error) {
      logger.error('Error finding available volunteers:', error);
      throw error;
    }
  }

  /**
   * Match donation with volunteers
   */
  async matchDonationWithVolunteers(donationId) {
    try {
      const donationDoc = await this.db.collection(COLLECTIONS.DONATIONS).doc(donationId).get();
      
      if (!donationDoc.exists) {
        throw new Error('Donation not found');
      }
      
      const donation = donationDoc.data();
      const volunteers = await this.findAvailableVolunteers(donation.location_lowercase);
      
      return {
        donation: { id: donationId, ...donation },
        matchedVolunteers: volunteers,
        matchCount: volunteers.length
      };
    } catch (error) {
      logger.error('Error matching donation with volunteers:', error);
      throw error;
    }
  }

  /**
   * Match community request with donors
   */
  async matchRequestWithDonors(requestId) {
    try {
      const requestDoc = await this.db.collection(COLLECTIONS.REQUESTS).doc(requestId).get();
      
      if (!requestDoc.exists) {
        throw new Error('Request not found');
      }
      
      const request = requestDoc.data();
      const donors = await this.findDonorsByLocation(request.location_lowercase);
      
      return {
        request: { id: requestId, ...request },
        matchedDonors: donors,
        matchCount: donors.length
      };
    } catch (error) {
      logger.error('Error matching request with donors:', error);
      throw error;
    }
  }

  /**
   * Get volunteer workload (number of active assignments)
   */
  async getVolunteerWorkload(volunteerId) {
    try {
      const [donationsSnapshot, requestsSnapshot] = await Promise.all([
        this.db.collection(COLLECTIONS.DONATIONS)
          .where('assignedTo', '==', volunteerId)
          .where('status', 'in', ['accepted', 'picked'])
          .get(),
        this.db.collection(COLLECTIONS.REQUESTS)
          .where('assignedTo', '==', volunteerId)
          .where('status', 'in', ['accepted', 'picked'])
          .get()
      ]);
      
      return {
        activeDonations: donationsSnapshot.size,
        activeRequests: requestsSnapshot.size,
        totalActive: donationsSnapshot.size + requestsSnapshot.size
      };
    } catch (error) {
      logger.error('Error getting volunteer workload:', error);
      throw error;
    }
  }

  /**
   * Find best volunteer for assignment (based on workload and location)
   */
  async findBestVolunteer(location, excludeVolunteers = []) {
    try {
      const volunteers = await this.findAvailableVolunteers(location);
      
      // Filter out excluded volunteers
      const availableVolunteers = volunteers.filter(v => !excludeVolunteers.includes(v.id));
      
      if (availableVolunteers.length === 0) {
        return null;
      }
      
      // Get workload for each volunteer
      const volunteersWithWorkload = await Promise.all(
        availableVolunteers.map(async (volunteer) => {
          const workload = await this.getVolunteerWorkload(volunteer.id);
          return { ...volunteer, workload: workload.totalActive };
        })
      );
      
      // Sort by workload (ascending) to find least busy volunteer
      volunteersWithWorkload.sort((a, b) => a.workload - b.workload);
      
      return volunteersWithWorkload[0];
    } catch (error) {
      logger.error('Error finding best volunteer:', error);
      throw error;
    }
  }

  /**
   * Get matching statistics for a location
   */
  async getMatchingStats(location) {
    try {
      const standardizedLocation = locationService.validateLocation(location);
      
      const [volunteers, pendingDonations, pendingRequests] = await Promise.all([
        this.findVolunteersByLocation(standardizedLocation),
        this.db.collection(COLLECTIONS.DONATIONS)
          .where('location_lowercase', '==', standardizedLocation)
          .where('status', '==', 'pending')
          .get(),
        this.db.collection(COLLECTIONS.REQUESTS)
          .where('location_lowercase', '==', standardizedLocation)
          .where('status', '==', 'pending')
          .get()
      ]);
      
      return {
        location: standardizedLocation,
        availableVolunteers: volunteers.length,
        pendingDonations: pendingDonations.size,
        pendingRequests: pendingRequests.size,
        matchingRatio: volunteers.length > 0 ? 
          (pendingDonations.size + pendingRequests.size) / volunteers.length : 0
      };
    } catch (error) {
      logger.error('Error getting matching stats:', error);
      throw error;
    }
  }
}

export default new MatchingService();