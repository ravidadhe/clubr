// ========================================================
// Clubr.online — Firebase Configuration & Cloud Database
// Powered by Google Firebase (clubr-online)
// ========================================================

const firebaseConfig = {
  apiKey: "AIzaSyAsE1K8xU8aTsCAAeY4vt6LcghKXySUpdY",
  authDomain: "clubr-online.firebaseapp.com",
  databaseURL: "https://clubr-online-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "clubr-online",
  storageBucket: "clubr-online.firebasestorage.app",
  messagingSenderId: "755964912538",
  appId: "1:755964912538:web:93393f32c5dabe59bf9023",
  measurementId: "G-QJ2PCZN8PE"
};

// Global Firebase References
let firebaseApp = null;
let firebaseAuth = null;
let firebaseDb = null;
let firebaseRtdb = null;
let isFirebaseLive = false;

try {
  if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) {
      firebaseApp = firebase.initializeApp(firebaseConfig);
    } else {
      firebaseApp = firebase.app();
    }
    firebaseAuth = firebase.auth();
    try { firebaseDb = firebase.firestore(); } catch(e) {}
    try { firebaseRtdb = firebase.database(); } catch(e) {}
    isFirebaseLive = true;
    console.log('[Clubr Cloud] ✅ Google Firebase live connected:', firebaseConfig.projectId);
  }
} catch (err) {
  console.warn('[Clubr Cloud] Firebase init error:', err.message);
}

// Transform Firebase User to Clubr Citizen Profile
async function formatClubrUserData(user) {
  let existingUser = null;

  // Try fetching from Cloud Firestore first
  if (firebaseDb) {
    try {
      const doc = await firebaseDb.collection('users').doc(user.uid).get();
      if (doc.exists) {
        existingUser = doc.data();
      }
    } catch(e) {
      console.warn('[Firestore Read]', e.message);
    }
  }

  // If not found in Firestore, check local store
  if (!existingUser) {
    try {
      const localUsers = JSON.parse(localStorage.getItem('clubr_registered_users') || '[]');
      existingUser = localUsers.find(u => u.id === user.uid || u.email === user.email);
    } catch(e) {}
  }

  const userData = {
    id: user.uid,
    name: (existingUser && existingUser.name) ? existingUser.name : (user.displayName || 'Clubr Citizen'),
    email: user.email || '',
    photoURL: user.photoURL || '',
    phone: (existingUser && existingUser.phone) ? existingUser.phone : '',
    city: (existingUser && existingUser.city) ? existingUser.city : 'Mumbai',
    bio: (existingUser && existingUser.bio) ? existingUser.bio : 'Community Member',
    kycStatus: (existingUser && existingUser.kycStatus) ? existingUser.kycStatus : 'none',
    kycDocType: (existingUser && existingUser.kycDocType) ? existingUser.kycDocType : '',
    kycDocNumber: (existingUser && existingUser.kycDocNumber) ? existingUser.kycDocNumber : '',
    registeredAt: (existingUser && existingUser.registeredAt) ? existingUser.registeredAt : new Date().toLocaleDateString('en-IN')
  };

  // Sync to Cloud Firestore in background
  if (firebaseDb) {
    firebaseDb.collection('users').doc(user.uid).set(userData, { merge: true }).catch(err => {
      console.warn('[Firestore Sync]', err.message);
    });
  }

  // Sync to local registered users list
  try {
    let all = JSON.parse(localStorage.getItem('clubr_registered_users') || '[]');
    const idx = all.findIndex(x => x.id === userData.id || x.email === userData.email);
    if (idx !== -1) {
      all[idx] = userData;
    } else {
      all.unshift(userData);
    }
    localStorage.setItem('clubr_registered_users', JSON.stringify(all));
  } catch(e) {}

  return userData;
}

// ========================================================
// 1-CLICK GOOGLE SIGN-IN (REAL GOOGLE POPUP & REDIRECT)
// ========================================================
async function clubrSignInWithGoogle() {
  if (!firebaseAuth) {
    return { success: false, error: 'Firebase Auth is not ready. Please refresh the page.' };
  }

  const provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('profile');
  provider.addScope('email');
  provider.setCustomParameters({ prompt: 'select_account' });

  try {
    const result = await firebaseAuth.signInWithPopup(provider);
    const userData = await formatClubrUserData(result.user);
    return { success: true, user: userData };
  } catch (popupErr) {
    console.warn('[Firebase Google Popup Notice]', popupErr.code, popupErr.message);

    // If popup is blocked by browser on mobile, use standard Redirect
    if (popupErr.code === 'auth/popup-blocked' || popupErr.code === 'auth/popup-closed-by-user') {
      try {
        await firebaseAuth.signInWithRedirect(provider);
        return { pendingRedirect: true };
      } catch (redirectErr) {
        return { success: false, error: redirectErr.message };
      }
    }
    return { success: false, error: popupErr.message };
  }
}

// ========================================================
// SIGN OUT
// ========================================================
async function clubrSignOut() {
  if (firebaseAuth) {
    try {
      await firebaseAuth.signOut();
    } catch(e) {}
  }
  localStorage.removeItem('clubr_current_user');
}

// ========================================================
// USER PROFILE UPDATE
// ========================================================
async function clubrUpdateUserProfile(userId, updates) {
  if (firebaseDb) {
    try {
      await firebaseDb.collection('users').doc(userId).set(updates, { merge: true });
    } catch(e) {
      console.warn('[Firestore User Update Notice]', e.message);
    }
  }

  try {
    let all = JSON.parse(localStorage.getItem('clubr_registered_users') || '[]');
    const idx = all.findIndex(u => u.id === userId);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...updates };
      localStorage.setItem('clubr_registered_users', JSON.stringify(all));
    }
  } catch(e) {}
}

// ========================================================
// CLOUD PUBLISH METHODS
// ========================================================
async function clubrPublishListing(listing) {
  if (firebaseDb) {
    try {
      await firebaseDb.collection('listings').doc(listing.id).set(listing);
    } catch(e) {
      console.warn('[Firestore Listing Publish]', e.message);
    }
  }
  if (firebaseRtdb) {
    try {
      firebaseRtdb.ref('listings/' + listing.id).set(listing);
    } catch(e) {}
  }
}

async function clubrPublishDemand(demand) {
  if (firebaseDb) {
    try {
      await firebaseDb.collection('demands').doc(demand.id).set(demand);
    } catch(e) {
      console.warn('[Firestore Demand Publish]', e.message);
    }
  }
  if (firebaseRtdb) {
    try {
      firebaseRtdb.ref('demands/' + demand.id).set(demand);
    } catch(e) {}
  }
}

async function clubrPublishKycRequest(req) {
  if (firebaseDb) {
    try {
      await firebaseDb.collection('kyc_requests').doc(req.id).set(req);
    } catch(e) {
      console.warn('[Firestore KYC Publish]', e.message);
    }
  }
  if (firebaseRtdb) {
    try {
      firebaseRtdb.ref('kyc_requests/' + req.id).set(req);
    } catch(e) {}
  }
}

// Auto-check redirect result on page load (for mobile logins)
if (typeof window !== 'undefined' && firebaseAuth) {
  window.addEventListener('load', () => {
    firebaseAuth.getRedirectResult().then(async (result) => {
      if (result && result.user) {
        const u = await formatClubrUserData(result.user);
        currentUser = u;
        if (typeof saveData === 'function') saveData();
        if (typeof updateUserUI === 'function') updateUserUI();
        if (typeof toast === 'function') toast(`👋 Welcome ${u.name}! Signed in via Google.`);
      }
    }).catch(err => {
      console.warn('[Firebase Auth Redirect]', err.message);
    });
  });
}
