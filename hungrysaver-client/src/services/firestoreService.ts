import { collection, addDoc, query, where, getDocs, doc, updateDoc, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { DonationData, RequestData } from '../types/formTypes';

// Collection references
export const donationsCollection = collection(db, 'donations');
export const requestsCollection = collection(db, 'community_requests');

// Donation operations
export const submitDonation = async (data: DonationData): Promise<string> => {
  try {
    const docRef = await addDoc(donationsCollection, {
      ...data,
      createdAt: new Date(),
      status: 'pending'
    });
    return docRef.id;
  } catch (error) {
    console.error('Error submitting donation:', error);
    throw error;
  }
};

// Request operations
export const submitRequest = async (data: RequestData): Promise<string> => {
  try {
    const docRef = await addDoc(requestsCollection, {
      ...data,
      createdAt: new Date(),
      status: 'pending'
    });
    return docRef.id;
  } catch (error) {
    console.error('Error submitting request:', error);
    throw error;
  }
};

// Get donations by location (with strict location filtering for volunteers)
export const getDonationsByLocation = async (location: string) => {
  try {
    const q = query(
      donationsCollection,
      where('location_lowercase', '==', location.toLowerCase()),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      type: 'donation' as const,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching donations:', error);
    throw error;
  }
};

// Get requests by location (with strict location filtering for volunteers)
export const getRequestsByLocation = async (location: string) => {
  try {
    const q = query(
      requestsCollection,
      where('location_lowercase', '==', location.toLowerCase()),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      type: 'request' as const,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching requests:', error);
    throw error;
  }
};

// Get user's donations
export const getUserDonations = async (userId: string) => {
  try {
    const q = query(
      donationsCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching user donations:', error);
    throw error;
  }
};

// Get user's requests
export const getUserRequests = async (userId: string) => {
  try {
    const q = query(
      requestsCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching user requests:', error);
    throw error;
  }
};

// Update task status
export const updateTaskStatus = async (
  taskId: string, 
  taskType: 'donation' | 'request', 
  status: string, 
  additionalData?: any
) => {
  try {
    const collectionRef = taskType === 'donation' ? donationsCollection : requestsCollection;
    const taskDoc = doc(collectionRef, taskId);
    
    await updateDoc(taskDoc, {
      status,
      ...additionalData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating task status:', error);
    throw error;
  }
};

// Get combined tasks for volunteers (STRICT location filtering)
export const getTasksByLocation = async (location: string) => {
  try {
    // Ensure location is lowercase for consistent filtering
    const normalizedLocation = location.toLowerCase();
    
    const [donations, requests] = await Promise.all([
      getDonationsByLocation(normalizedLocation),
      getRequestsByLocation(normalizedLocation)
    ]);
    
    // Double-check location filtering on client side for security
    const filteredDonations = donations.filter(d => 
      d.location_lowercase === normalizedLocation
    );
    const filteredRequests = requests.filter(r => 
      r.location_lowercase === normalizedLocation
    );
    
    // Combine and sort by creation date
    const allTasks = [...filteredDonations, ...filteredRequests].sort((a, b) => {
      const aTime = a.createdAt?.toDate?.() || new Date(0);
      const bTime = b.createdAt?.toDate?.() || new Date(0);
      return bTime.getTime() - aTime.getTime();
    });
    
    return allTasks;
  } catch (error) {
    console.error('Error fetching tasks by location:', error);
    throw error;
  }
};