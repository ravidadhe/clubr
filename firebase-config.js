// ========================================================
// Clubr.online — Firebase Configuration & Cloud Database
// Powered by Google Firebase (Authentication & Firestore)
// ========================================================

// 1. YOUR FIREBASE CONFIGURATION
// To get your live keys:
// 1. Visit https://console.firebase.google.com/
// 2. Create a project "clubr-marketplace" (or your own project)
// 3. Enable Authentication -> Sign-in method -> Google
// 4. In Authorized domains: add "clubr.online" and "localhost"
// 5. Create Cloud Firestore in Test / Production mode
// 6. Project Settings -> Your apps -> Web app (</>) -> Copy config below:

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "clubr-marketplace.firebaseapp.com",
  projectId: "clubr-marketplace",
  storageBucket: "clubr-marketplace.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

// ========================================================
// FIREBASE INITIALIZATION WITH SMART HYBRID FALLBACK
// ========================================================
let firebaseApp = null;
let firebaseAuth = null;
let firebaseDb = null;
let isFirebaseLive = false;

try {
  if (typeof firebase !== 'undefined' && firebase.initializeApp) {
    if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_FIREBASE_API_KEY") {
      firebaseApp = firebase.initializeApp(firebaseConfig);
      firebaseAuth = firebase.auth();
      firebaseDb = firebase.firestore();
      isFirebaseLive = true;
      console.log('[Clubr Cloud] ✅ Google Firebase connected to live project:', firebaseConfig.projectId);
    } else {
      console.log('[Clubr Cloud] ℹ️ Using simulated Google OAuth & local cloud persistence until live API keys are provided in firebase-config.js');
    }
  }
} catch (err) {
  console.warn('[Clubr Cloud] Firebase init notice:', err.message);
}

// ========================================================
// 1-CLICK GOOGLE SIGN-IN HANDLER (NO PHONE / NO PASSWORD)
// ========================================================
async function clubrSignInWithGoogle() {
  if (isFirebaseLive && firebaseAuth) {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      const result = await firebaseAuth.signInWithPopup(provider);
      const user = result.user;

      // Sync or create user record in Cloud Firestore
      const userDocRef = firebaseDb.collection('users').doc(user.uid);
      const docSnap = await userDocRef.get();
      let userData = null;

      if (!docSnap.exists) {
        userData = {
          id: user.uid,
          name: user.displayName || 'Google User',
          email: user.email || '',
          photoURL: user.photoURL || '',
          phone: '',
          city: 'Mumbai',
          bio: '',
          kycStatus: 'none',
          kycDocType: '',
          kycDocNumber: '',
          registeredAt: new Date().toLocaleDateString('en-IN')
        };
        await userDocRef.set(userData);
      } else {
        userData = docSnap.data();
      }

      return { success: true, user: userData };
    } catch (error) {
      console.error('[Google Sign-In Error]', error);
      return { success: false, error: error.message };
    }
  } else {
    // Interactive Simulation / Fallback for local testing before API keys
    return new Promise((resolve) => {
      // Simulate Google OAuth Account Chooser
      const defaultName = "Ravi Dadhe";
      const defaultEmail = "ravidadhe@gmail.com";
      const enteredEmail = prompt("Google Sign-In (Simulation):\nEnter your Google Email to continue:", defaultEmail);
      if (!enteredEmail) {
        resolve({ success: false, error: 'Sign-in was cancelled.' });
        return;
      }
      const enteredName = prompt("Enter your Full Display Name:", defaultName) || "Google Member";
      
      const simulatedUser = {
        id: 'usr_g_' + Math.abs(enteredEmail.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)),
        name: enteredName,
        email: enteredEmail,
        photoURL: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
        phone: '',
        city: 'Mumbai',
        bio: 'Community member on Clubr',
        kycStatus: 'none',
        kycDocType: '',
        kycDocNumber: '',
        registeredAt: new Date().toLocaleDateString('en-IN')
      };

      // Check if user already exists in local DB
      let allUsers = [];
      try {
        const saved = localStorage.getItem('clubr_registered_users');
        if (saved) allUsers = JSON.parse(saved);
      } catch(e) {}

      const existing = allUsers.find(u => u.email === enteredEmail || u.id === simulatedUser.id);
      if (existing) {
        resolve({ success: true, user: existing });
      } else {
        allUsers.unshift(simulatedUser);
        localStorage.setItem('clubr_registered_users', JSON.stringify(allUsers));
        resolve({ success: true, user: simulatedUser });
      }
    });
  }
}

// ========================================================
// SIGN OUT HANDLER
// ========================================================
async function clubrSignOut() {
  if (isFirebaseLive && firebaseAuth) {
    await firebaseAuth.signOut();
  }
  localStorage.removeItem('clubr_current_user');
}

// ========================================================
// USER PROFILE UPDATE HANDLER
// ========================================================
async function clubrUpdateUserProfile(userId, profileUpdates) {
  if (isFirebaseLive && firebaseDb) {
    try {
      await firebaseDb.collection('users').doc(userId).update(profileUpdates);
    } catch(e) {
      console.error('[Firestore Profile Update Error]', e);
    }
  }

  // Update in local store
  try {
    let allUsers = JSON.parse(localStorage.getItem('clubr_registered_users') || '[]');
    const idx = allUsers.findIndex(u => u.id === userId);
    if (idx !== -1) {
      allUsers[idx] = { ...allUsers[idx], ...profileUpdates };
      localStorage.setItem('clubr_registered_users', JSON.stringify(allUsers));
    }
  } catch(e) {}
}

// ========================================================
// FIRESTORE LISTING & DEMAND SYNC HELPERS
// ========================================================
async function clubrPublishListing(listing) {
  if (isFirebaseLive && firebaseDb) {
    try {
      await firebaseDb.collection('listings').doc(listing.id).set(listing);
    } catch(e) {
      console.error('[Firestore Publish Error]', e);
    }
  }
}

async function clubrPublishDemand(demand) {
  if (isFirebaseLive && firebaseDb) {
    try {
      await firebaseDb.collection('demands').doc(demand.id).set(demand);
    } catch(e) {
      console.error('[Firestore Demand Error]', e);
    }
  }
}

async function clubrPublishKycRequest(req) {
  if (isFirebaseLive && firebaseDb) {
    try {
      await firebaseDb.collection('kyc_requests').doc(req.id).set(req);
    } catch(e) {
      console.error('[Firestore KYC Error]', e);
    }
  }
}
