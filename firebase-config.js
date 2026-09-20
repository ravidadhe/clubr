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

// Transform Firebase User to Clubr User Profile
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
      existingUser = localUsers.find(u => u.id === user.uid || (user.email && u.email === user.email) || (user.phoneNumber && u.phone && u.phone.includes(user.phoneNumber.slice(-10))));
    } catch(e) {}
  }

  const rawPhone = user.phoneNumber ? user.phoneNumber.replace(/^\+91/, '') : '';
  const phone = (existingUser && existingUser.phone) ? existingUser.phone : rawPhone;
  const defaultName = user.displayName ? user.displayName : (phone ? ('User ' + phone.slice(-4)) : 'Clubr User');

  const userData = {
    id: user.uid,
    name: (existingUser && existingUser.name) ? existingUser.name : defaultName,
    email: (existingUser && existingUser.email) ? existingUser.email : (user.email || ''),
    photoURL: (existingUser && existingUser.photoURL) ? existingUser.photoURL : (user.photoURL || ''),
    phone: phone,
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
    const idx = all.findIndex(x => x.id === userData.id || (userData.email && x.email === userData.email) || (userData.phone && x.phone === userData.phone));
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
  // Detect file:// protocol (won't work with Firebase Auth)
  if (window.location.protocol === 'file:') {
    return {
      success: false,
      error: '⚠️ File Protocol Detected!\n\nGoogle Sign-In does not work when opening files directly from your computer.\n\nPlease run the app using a local server:\n1. Open terminal/PowerShell in the FRONTNEWS folder\n2. Run: node server.js\n3. Open browser at: http://localhost:3000'
    };
  }

  if (!firebaseAuth) {
    return { success: false, error: 'Firebase Auth is not ready. Please refresh the page and try again.' };
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

    // Friendly error messages for common Firebase Auth errors
    if (popupErr.code === 'auth/unauthorized-domain') {
      const domain = window.location.hostname;
      return {
        success: false,
        error: `❌ Domain "${domain}" is not authorized in Firebase.\n\nFix: Go to Firebase Console → Authentication → Settings → Authorized Domains → Add "${domain}" or use localhost:3000\n\nOR run: node server.js and open http://localhost:3000`
      };
    }

    if (popupErr.code === 'auth/popup-blocked') {
      // Try redirect as fallback for popup-blocked scenario
      try {
        await firebaseAuth.signInWithRedirect(provider);
        return { pendingRedirect: true };
      } catch (redirectErr) {
        return { success: false, error: 'Popup was blocked and redirect also failed. Please allow popups for this site in your browser settings.' };
      }
    }

    if (popupErr.code === 'auth/popup-closed-by-user') {
      return { success: false, error: 'Sign-In popup was closed. Please try again.' };
    }

    if (popupErr.code === 'auth/cancelled-popup-request') {
      return { success: false, error: 'Another sign-in request is in progress. Please wait a moment and try again.' };
    }

    if (popupErr.code === 'auth/network-request-failed') {
      return { success: false, error: '❌ Network error! Please check your internet connection and try again.' };
    }

    if (popupErr.code === 'auth/internal-error') {
      return { success: false, error: '❌ Firebase internal error. This usually means the domain is not authorized. Run: node server.js and open http://localhost:3000' };
    }

    // Fallback redirect for mobile / any other popup failure
    try {
      await firebaseAuth.signInWithRedirect(provider);
      return { pendingRedirect: true };
    } catch (redirectErr) {
      return { success: false, error: popupErr.message };
    }
  }
}

// ========================================================
// REAL FIREBASE PHONE AUTHENTICATION (SMS OTP + RECAPTCHA)
// ========================================================
let clubrRecaptchaVerifier = null;
window.clubrConfirmationResult = null;

function getOrCreateRecaptcha() {
  const container = document.getElementById('recaptcha-container');
  if (!container) {
    console.error('[Firebase Phone Auth] #recaptcha-container element missing in DOM');
    return null;
  }

  if (!clubrRecaptchaVerifier) {
    try {
      clubrRecaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        size: 'invisible',
        callback: () => {
          console.log('[Clubr Recaptcha] Verified successfully');
        },
        'expired-callback': () => {
          console.warn('[Clubr Recaptcha] Expired, resetting...');
          resetRecaptchaVerifier();
        }
      });
    } catch(err) {
      console.warn('[Recaptcha Init Error]', err);
    }
  }
  return clubrRecaptchaVerifier;
}

function resetRecaptchaVerifier() {
  if (clubrRecaptchaVerifier) {
    try {
      clubrRecaptchaVerifier.clear();
    } catch(e) {}
    clubrRecaptchaVerifier = null;
  }
  const container = document.getElementById('recaptcha-container');
  if (container) container.innerHTML = '';
}

async function clubrSendPhoneOtp(phoneNumber) {
  if (!firebaseAuth) {
    return { success: false, error: 'Firebase Auth is not ready. Please refresh the page.' };
  }

  const clean = String(phoneNumber || '').replace(/\D/g, '');
  if (clean.length !== 10) {
    return { success: false, error: 'Please enter a valid 10-digit mobile number (e.g. 9823012345)' };
  }

  const e164 = '+91' + clean;

  try {
    const verifier = getOrCreateRecaptcha();
    if (!verifier) {
      return { success: false, error: 'Verification container missing. Please refresh the page.' };
    }
    const confirmationResult = await firebaseAuth.signInWithPhoneNumber(e164, verifier);
    window.clubrConfirmationResult = confirmationResult;
    return { success: true, phoneNumber: e164, cleanPhone: clean };
  } catch (err) {
    console.error('[Firebase Phone Auth Error]', err);
    resetRecaptchaVerifier();
    let msg = err.message || 'Failed to send SMS OTP.';
    if (err.code === 'auth/invalid-phone-number') {
      msg = 'The mobile number provided is invalid. Please check the 10 digits.';
    } else if (err.code === 'auth/quota-exceeded') {
      msg = 'Daily SMS quota reached. Please sign in with Google or try again tomorrow.';
    } else if (err.code === 'auth/billing-not-enabled') {
      msg = 'SMS service setup required. Please use Google Sign-In or enable Phone provider in Firebase Console.';
    } else if (err.code === 'auth/operation-not-allowed') {
      msg = 'Phone authentication is not enabled in Firebase Console. Please toggle Phone provider to "Enable" in Firebase Console.';
    } else if (err.code === 'auth/too-many-requests') {
      msg = 'Too many attempts. Please wait a few minutes before requesting another OTP.';
    }
    return { success: false, error: msg, code: err.code };
  }
}

async function clubrVerifyPhoneOtp(otpCode) {
  if (!window.clubrConfirmationResult) {
    return { success: false, error: 'No active OTP session found. Please enter your mobile number again.' };
  }

  const cleanOtp = String(otpCode || '').replace(/\D/g, '');
  if (cleanOtp.length !== 6) {
    return { success: false, error: 'Please enter the complete 6-digit OTP code received via SMS.' };
  }

  try {
    const result = await window.clubrConfirmationResult.confirm(cleanOtp);
    const userData = await formatClubrUserData(result.user);
    window.clubrConfirmationResult = null;
    return { success: true, user: userData };
  } catch (err) {
    console.error('[Firebase OTP Verify Error]', err);
    let msg = err.message || 'Verification failed.';
    if (err.code === 'auth/invalid-verification-code') {
      msg = 'Incorrect SMS OTP code. Please enter the valid 6-digit code received on your phone.';
    } else if (err.code === 'auth/code-expired') {
      msg = 'This SMS OTP has expired. Please click Resend OTP to request a fresh code.';
    }
    return { success: false, error: msg, code: err.code };
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

async function clubrPublishFraudReport(report) {
  if (firebaseDb) {
    try {
      await firebaseDb.collection('fraud_reports').doc(report.id).set(report);
    } catch(e) {
      console.warn('[Firestore Fraud Report Publish]', e.message);
    }
  }
}

// ========================================================
// LIVE CLOUD FETCH & QUERY METHODS
// ========================================================
async function clubrFetchLiveListings() {
  if (!firebaseDb) return null;
  try {
    const snapshot = await firebaseDb.collection('listings').get();
    if (!snapshot.empty) {
      const items = [];
      snapshot.forEach(doc => {
        items.push({ ...doc.data(), id: doc.id });
      });
      return items;
    }
    return [];
  } catch(e) {
    console.warn('[Firestore Fetch Listings]', e.message);
    return null;
  }
}

async function clubrFetchLiveDemands() {
  if (!firebaseDb) return null;
  try {
    const snapshot = await firebaseDb.collection('demands').get();
    if (!snapshot.empty) {
      const items = [];
      snapshot.forEach(doc => {
        items.push({ ...doc.data(), id: doc.id });
      });
      return items;
    }
    return [];
  } catch(e) {
    console.warn('[Firestore Fetch Demands]', e.message);
    return null;
  }
}

async function clubrFetchLiveUsers() {
  if (!firebaseDb) return null;
  try {
    const snapshot = await firebaseDb.collection('users').get();
    if (!snapshot.empty) {
      const users = [];
      snapshot.forEach(doc => {
        users.push({ ...doc.data(), id: doc.id });
      });
      return users;
    }
    return [];
  } catch(e) {
    console.warn('[Firestore Fetch Users]', e.message);
    return null;
  }
}

async function clubrFetchLiveKycRequests() {
  if (!firebaseDb) return null;
  try {
    const snapshot = await firebaseDb.collection('kyc_requests').get();
    if (!snapshot.empty) {
      const reqs = [];
      snapshot.forEach(doc => {
        reqs.push({ ...doc.data(), id: doc.id });
      });
      return reqs;
    }
    return [];
  } catch(e) {
    console.warn('[Firestore Fetch KYC]', e.message);
    return null;
  }
}

async function clubrFetchLiveFraudReports() {
  if (!firebaseDb) return null;
  try {
    const snapshot = await firebaseDb.collection('fraud_reports').get();
    if (!snapshot.empty) {
      const reports = [];
      snapshot.forEach(doc => {
        reports.push({ ...doc.data(), id: doc.id });
      });
      return reports;
    }
    return [];
  } catch(e) {
    console.warn('[Firestore Fetch Fraud Reports]', e.message);
    return null;
  }
}

// ========================================================
// LIVE CLOUD DELETE / MODERATION METHODS
// ========================================================
async function clubrDeleteLiveListing(listingId) {
  if (firebaseDb) {
    try {
      await firebaseDb.collection('listings').doc(listingId).delete();
    } catch(e) {
      console.warn('[Firestore Delete Listing]', e.message);
    }
  }
  if (firebaseRtdb) {
    try {
      firebaseRtdb.ref('listings/' + listingId).remove();
    } catch(e) {}
  }
}

async function clubrDeleteLiveDemand(demandId) {
  if (firebaseDb) {
    try {
      await firebaseDb.collection('demands').doc(demandId).delete();
    } catch(e) {
      console.warn('[Firestore Delete Demand]', e.message);
    }
  }
  if (firebaseRtdb) {
    try {
      firebaseRtdb.ref('demands/' + demandId).remove();
    } catch(e) {}
  }
}

async function clubrDeleteLiveUser(userId, userEmail, userPhone, userName) {
  if (!userId && !userEmail && !userPhone && !userName) return;
  if (firebaseDb) {
    try {
      if (userId && userId !== 'undefined' && userId !== 'null' && userId !== 'usr_x') {
        await firebaseDb.collection('users').doc(userId).delete();
      }
    } catch(e) {
      console.warn('[Firestore Delete User]', e.message);
    }

    // Delete any documents with matching email or phone
    try {
      if (userEmail) {
        const snapEmail = await firebaseDb.collection('users').where('email', '==', userEmail).get();
        snapEmail.forEach(d => d.ref.delete());
      }
      if (userPhone) {
        const snapPhone = await firebaseDb.collection('users').where('phone', '==', userPhone).get();
        snapPhone.forEach(d => d.ref.delete());
      }
    } catch(e) {}

    // Cascade delete any listings belonging to this user
    try {
      if (userId && userId !== 'undefined') {
        const snap = await firebaseDb.collection('listings').where('sellerId', '==', userId).get();
        if (!snap.empty) {
          const batch = firebaseDb.batch();
          snap.forEach(doc => batch.delete(doc.ref));
          await batch.commit();
        }
      }
      if (userName) {
        const snapName = await firebaseDb.collection('listings').where('seller', '==', userName).get();
        if (!snapName.empty) {
          const batch2 = firebaseDb.batch();
          snapName.forEach(doc => batch2.delete(doc.ref));
          await batch2.commit();
        }
      }
    } catch(e) {}

    // Cascade delete any demands belonging to this user
    try {
      if (userId && userId !== 'undefined') {
        const snap = await firebaseDb.collection('demands').where('buyerId', '==', userId).get();
        if (!snap.empty) {
          const batch = firebaseDb.batch();
          snap.forEach(doc => batch.delete(doc.ref));
          await batch.commit();
        }
      }
      if (userName) {
        const snapName = await firebaseDb.collection('demands').where('buyer', '==', userName).get();
        if (!snapName.empty) {
          const batch2 = firebaseDb.batch();
          snapName.forEach(doc => batch2.delete(doc.ref));
          await batch2.commit();
        }
      }
    } catch(e) {}

    // Cascade delete KYC requests
    try {
      if (userId && userId !== 'undefined') {
        const snap = await firebaseDb.collection('kyc_requests').where('userId', '==', userId).get();
        snap.forEach(doc => doc.ref.delete());
      }
      if (userName) {
        const snap = await firebaseDb.collection('kyc_requests').where('userName', '==', userName).get();
        snap.forEach(doc => doc.ref.delete());
      }
    } catch(e) {}
  }

  if (firebaseRtdb) {
    try {
      if (userId && userId !== 'undefined') {
        firebaseRtdb.ref('users/' + userId).remove();
      }
    } catch(e) {}
  }
}

async function clubrToggleBlockLiveUser(userId, isBlocked, userEmail, userPhone) {
  if (!userId && !userEmail && !userPhone) return;
  if (firebaseDb) {
    try {
      if (userId && userId !== 'undefined' && userId !== 'usr_x') {
        await firebaseDb.collection('users').doc(userId).set({
          isBlocked: !!isBlocked,
          blockedAt: isBlocked ? new Date().toISOString() : null
        }, { merge: true });
      }
      if (userEmail) {
        const snap = await firebaseDb.collection('users').where('email', '==', userEmail).get();
        snap.forEach(doc => doc.ref.set({ isBlocked: !!isBlocked, blockedAt: isBlocked ? new Date().toISOString() : null }, { merge: true }));
      }
    } catch(e) {
      console.warn('[Firestore Toggle Block User]', e.message);
    }
  }
  if (firebaseRtdb) {
    try {
      if (userId && userId !== 'undefined') {
        firebaseRtdb.ref('users/' + userId + '/isBlocked').set(!!isBlocked);
      }
    } catch(e) {}
  }
}

// ========================================================
// REAL-TIME PRESENCE & LIVE TELEMETRY
// ========================================================
function clubrInitLivePresence(pageName) {
  if (!firebaseRtdb) return;
  try {
    let sessionId = sessionStorage.getItem('clubr_presence_session');
    if (!sessionId) {
      sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
      sessionStorage.setItem('clubr_presence_session', sessionId);
    }

    const sessionRef = firebaseRtdb.ref('presence/' + sessionId);
    const connectedRef = firebaseRtdb.ref('.info/connected');

    connectedRef.on('value', (snap) => {
      if (snap.val() === true) {
        sessionRef.onDisconnect().remove();
        sessionRef.set({
          active: true,
          page: pageName || 'marketplace',
          city: (typeof currentCity !== 'undefined' && currentCity) ? currentCity : 'All Cities',
          userAgent: navigator.userAgent || '',
          isMobile: /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent || ''),
          timestamp: firebase.database.ServerValue.TIMESTAMP
        });
      }
    });

    // Record daily unique pageview in RTDB
    const todayKey = new Date().toISOString().slice(0, 10);
    const pvSessionKey = 'clubr_pv_' + todayKey;
    if (!sessionStorage.getItem(pvSessionKey)) {
      sessionStorage.setItem(pvSessionKey, '1');
      firebaseRtdb.ref('stats/pageviews/' + todayKey).transaction((curr) => (curr || 0) + 1);
    }
  } catch(e) {
    console.warn('[Presence Tracker Notice]', e.message);
  }
}

async function clubrUpdateLiveKycStatus(reqId, userId, status) {
  if (firebaseDb) {
    try {
      if (reqId) await firebaseDb.collection('kyc_requests').doc(reqId).set({ status }, { merge: true });
      if (userId) await firebaseDb.collection('users').doc(userId).set({ kycStatus: status }, { merge: true });
    } catch(e) {
      console.warn('[Firestore KYC Update]', e.message);
    }
  }
}

async function clubrUpdateLiveFraudReport(reportId, updates) {
  if (firebaseDb && reportId) {
    try {
      await firebaseDb.collection('fraud_reports').doc(reportId).set(updates, { merge: true });
    } catch(e) {
      console.warn('[Firestore Report Update]', e.message);
    }
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

// =====================================================
// SITE SETTINGS — Monetization Control
// Admin se ON/OFF karo charging mode
// Firebase RTDB: siteSettings/chargingEnabled, pricePerListing, razorpayKeyId
// =====================================================

window.clubrListenSiteSettings = function(callback) {
  if (!firebaseRtdb) {
    callback({ chargingEnabled: false, pricePerListing: 10, razorpayKeyId: '' });
    return;
  }
  firebaseRtdb.ref('siteSettings').on('value', (snap) => {
    const data = snap.val() || {};
    callback({
      chargingEnabled: data.chargingEnabled === true,
      pricePerListing: data.pricePerListing || 10,
      razorpayKeyId: data.razorpayKeyId || ''
    });
  });
};

window.clubrGetSiteSettings = async function() {
  if (!firebaseRtdb) return { chargingEnabled: false, pricePerListing: 10, razorpayKeyId: '' };
  try {
    const snap = await firebaseRtdb.ref('siteSettings').once('value');
    const data = snap.val() || {};
    return {
      chargingEnabled: data.chargingEnabled === true,
      pricePerListing: data.pricePerListing || 10,
      razorpayKeyId: data.razorpayKeyId || ''
    };
  } catch(e) {
    return { chargingEnabled: false, pricePerListing: 10, razorpayKeyId: '' };
  }
};

window.clubrSaveSiteSettings = async function(settings) {
  if (!firebaseRtdb) return false;
  try {
    await firebaseRtdb.ref('siteSettings').set({
      chargingEnabled: settings.chargingEnabled === true,
      pricePerListing: Number(settings.pricePerListing) || 10,
      razorpayKeyId: settings.razorpayKeyId || '',
      updatedAt: Date.now()
    });
    return true;
  } catch(e) {
    console.warn('[Clubr Settings Save]', e.message);
    return false;
  }
};

window.clubrRecordPayment = async function(paymentData) {
  if (!firebaseDb) return;
  try {
    await firebaseDb.collection('payments').add({
      userId: paymentData.userId || '',
      userName: paymentData.userName || '',
      userEmail: paymentData.userEmail || '',
      amount: paymentData.amount || 0,
      listingTitle: paymentData.listingTitle || '',
      razorpayPaymentId: paymentData.razorpayPaymentId || '',
      razorpayOrderId: paymentData.razorpayOrderId || '',
      status: 'success',
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      timestamp: Date.now()
    });
  } catch(e) {
    console.warn('[Clubr Payment Record]', e.message);
  }
};
