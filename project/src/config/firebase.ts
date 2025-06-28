import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAN5MwiXCAjfusWJ0s626NUD48NJB_gYDM",
  authDomain: "hungrysaver-41b9e.firebaseapp.com",
  projectId: "hungrysaver-41b9e",
  storageBucket: "hungrysaver-41b9e.firebasestorage.app",
  messagingSenderId: "107363713066",
  appId: "1:107363713066:web:7d9a4ce0ebce7231bd8353"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Configure Google Auth Provider with proper settings
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Add required scopes
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Enable persistence
auth.useDeviceLanguage();

// Development emulator setup (only if explicitly enabled)
if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
  try {
    // Check if emulators are available before connecting
    const checkEmulator = async () => {
      try {
        const response = await fetch('http://localhost:8080');
        return response.ok;
      } catch {
        return false;
      }
    };

    checkEmulator().then((emulatorAvailable) => {
      if (emulatorAvailable && !auth.emulatorConfig) {
        try {
          connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
          connectFirestoreEmulator(db, 'localhost', 8080);
          connectStorageEmulator(storage, 'localhost', 9199);
          console.log('Connected to Firebase emulators');
        } catch (error) {
          console.log('Failed to connect to emulators, using production Firebase');
        }
      } else {
        console.log('Using production Firebase services');
      }
    });
  } catch (error) {
    console.log('Using production Firebase services');
  }
}

export default app;