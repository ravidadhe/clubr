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

  // Try fetching from Cloud RTDB first
  if (firebaseRtdb) {
    try {
      const snap = await firebaseRtdb.ref('users/' + user.uid).once('value');
      if (snap.exists()) {
        existingUser = snap.val();
      }
    } catch(e) {}
  }

  // If not found in RTDB, check local store
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

  // Sync to Cloud RTDB (instant)
  if (firebaseRtdb) {
    firebaseRtdb.ref('users/' + user.uid).set(userData).catch(() => {});
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
  if (firebaseRtdb) {
    try {
      await firebaseRtdb.ref('users/' + userId).update(updates);
    } catch(e) {}
  }
  if (firebaseDb) {
    firebaseDb.collection('users').doc(userId).set(updates, { merge: true }).catch(() => {});
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

// Helper to sanitize objects for cloud database
function sanitizeForFirestore(obj) {
  try {
    return JSON.parse(JSON.stringify(obj, (k, v) => v === undefined ? null : v));
  } catch(e) {
    return obj;
  }
}

// Purge any residual test / dummy listings from previous sessions
const CLUBR_BLOCKED_DUMMY_IDS = new Set([
  'lst_1789893248696',
  'lst_hunter350_mum',
  'lst_sonyxm5_blr'
]);

(function purgeClubrDummyData() {
  try {
    const raw = localStorage.getItem('findly_listings');
    if (raw) {
      const list = JSON.parse(raw);
      const filtered = list.filter(item => item && item.id && !CLUBR_BLOCKED_DUMMY_IDS.has(item.id));
      localStorage.setItem('findly_listings', JSON.stringify(filtered));
    }
  } catch(e) {}
})();

// ========================================================
// CLOUD PUBLISH METHODS (RTDB Primary - Instant 50ms)
// ========================================================
async function clubrPublishListing(listing) {
  if (!listing || !listing.id) return { success: false, error: 'Invalid listing object' };
  if (CLUBR_BLOCKED_DUMMY_IDS.has(listing.id)) {
    return { success: false, error: 'Blocked test listing' };
  }
  const safeDoc = sanitizeForFirestore(listing);

  // 1. RTDB (Instant primary cloud storage)
  if (firebaseRtdb) {
    try {
      await firebaseRtdb.ref('listings/' + listing.id).set(safeDoc);
      console.log('[Clubr Cloud] ✅ Listing saved live to RTDB:', listing.id);
    } catch(e) {
      console.warn('[RTDB Listing Publish]', e.message);
    }
  }

  // 2. Background Firestore mirror (non-blocking)
  if (firebaseDb) {
    firebaseDb.collection('listings').doc(listing.id).set(safeDoc).catch(() => {});
  }

  return { success: true };
}

async function clubrPublishDemand(demand) {
  if (!demand || !demand.id) return { success: false, error: 'Invalid demand object' };
  const safeDoc = sanitizeForFirestore(demand);

  if (firebaseRtdb) {
    try {
      await firebaseRtdb.ref('demands/' + demand.id).set(safeDoc);
      console.log('[Clubr Cloud] ✅ Demand saved live to RTDB:', demand.id);
    } catch(e) {}
  }

  if (firebaseDb) {
    firebaseDb.collection('demands').doc(demand.id).set(safeDoc).catch(() => {});
  }

  return { success: true };
}

async function clubrPublishKycRequest(req) {
  if (!req || !req.id) return;
  const safeDoc = sanitizeForFirestore(req);
  if (firebaseRtdb) {
    try {
      await firebaseRtdb.ref('kyc_requests/' + req.id).set(safeDoc);
    } catch(e) {}
  }
  if (firebaseDb) {
    firebaseDb.collection('kyc_requests').doc(req.id).set(safeDoc).catch(() => {});
  }
}

async function clubrPublishFraudReport(report) {
  if (!report || !report.id) return;
  const safeDoc = sanitizeForFirestore(report);
  if (firebaseRtdb) {
    try {
      await firebaseRtdb.ref('fraud_reports/' + report.id).set(safeDoc);
    } catch(e) {}
  }
  if (firebaseDb) {
    firebaseDb.collection('fraud_reports').doc(report.id).set(safeDoc).catch(() => {});
  }
}

// ========================================================
// LIVE CLOUD FETCH & QUERY METHODS (RTDB Primary)
// ========================================================
async function clubrFetchLiveListings() {
  if (firebaseRtdb) {
    try {
      const rtdbSnap = await firebaseRtdb.ref('listings').once('value');
      const val = rtdbSnap.val();
      if (val && typeof val === 'object') {
        const items = Object.keys(val)
          .filter(k => !CLUBR_BLOCKED_DUMMY_IDS.has(k))
          .map(k => ({ ...val[k], id: k }));
        // Newest listings first
        return items.reverse();
      }
      return [];
    } catch(err) {
      console.warn('[RTDB Fetch Listings]', err.message);
    }
  }

  if (firebaseDb) {
    try {
      const snapshot = await firebaseDb.collection('listings').get();
      if (!snapshot.empty) {
        const items = [];
        snapshot.forEach(doc => {
          if (!CLUBR_BLOCKED_DUMMY_IDS.has(doc.id)) {
            items.push({ ...doc.data(), id: doc.id });
          }
        });
        return items.reverse();
      }
    } catch(e) {}
  }

  return [];
}

async function clubrFetchLiveDemands() {
  if (firebaseRtdb) {
    try {
      const rtdbSnap = await firebaseRtdb.ref('demands').once('value');
      const val = rtdbSnap.val();
      if (val && typeof val === 'object') {
        const items = Object.keys(val).map(k => ({ ...val[k], id: k }));
        return items.reverse();
      }
      return [];
    } catch(err) {}
  }

  if (firebaseDb) {
    try {
      const snapshot = await firebaseDb.collection('demands').get();
      if (!snapshot.empty) {
        const items = [];
        snapshot.forEach(doc => items.push({ ...doc.data(), id: doc.id }));
        return items.reverse();
      }
    } catch(e) {}
  }

  return [];
}

async function clubrFetchLiveUsers() {
  if (firebaseRtdb) {
    try {
      const rtdbSnap = await firebaseRtdb.ref('users').once('value');
      const val = rtdbSnap.val();
      if (val && typeof val === 'object') {
        return Object.keys(val).map(k => ({ ...val[k], id: k }));
      }
      return [];
    } catch(err) {}
  }

  if (firebaseDb) {
    try {
      const snapshot = await firebaseDb.collection('users').get();
      if (!snapshot.empty) {
        const users = [];
        snapshot.forEach(doc => users.push({ ...doc.data(), id: doc.id }));
        return users;
      }
    } catch(e) {}
  }

  return [];
}

async function clubrFetchLiveKycRequests() {
  if (firebaseRtdb) {
    try {
      const snapshot = await firebaseRtdb.ref('kyc_requests').once('value');
      const val = snapshot.val();
      if (val && typeof val === 'object') {
        return Object.keys(val).map(k => ({ ...val[k], id: k }));
      }
      return [];
    } catch(e) {}
  }
  return [];
}

async function clubrFetchLiveFraudReports() {
  if (firebaseRtdb) {
    try {
      const snapshot = await firebaseRtdb.ref('fraud_reports').once('value');
      const val = snapshot.val();
      if (val && typeof val === 'object') {
        return Object.keys(val).map(k => ({ ...val[k], id: k }));
      }
      return [];
    } catch(e) {}
  }
  return [];
}

// ========================================================
// LIVE CLOUD DELETE / MODERATION METHODS
// ========================================================
async function clubrDeleteLiveListing(listingId) {
  if (firebaseRtdb) {
    try {
      await firebaseRtdb.ref('listings/' + listingId).remove();
    } catch(e) {}
  }
  if (firebaseDb) {
    firebaseDb.collection('listings').doc(listingId).delete().catch(() => {});
  }
}

async function clubrDeleteLiveDemand(demandId) {
  if (firebaseRtdb) {
    try {
      await firebaseRtdb.ref('demands/' + demandId).remove();
    } catch(e) {}
  }
  if (firebaseDb) {
    firebaseDb.collection('demands').doc(demandId).delete().catch(() => {});
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

// ========================================================
// REAL-TIME IN-APP CHAT & NOTIFICATION ENGINE
// Powered by Google Firebase RTDB
// ========================================================

/**
 * Send a message across Firebase RTDB with instant dual-inbox delivery
 */
async function clubrSendChatMessage(messageData) {
  if (!firebaseRtdb) return null;
  const msgId = messageData.id || ('msg_' + Date.now());
  const now = Date.now();
  const fullMsg = {
    ...messageData,
    id: msgId,
    timestamp: messageData.timestamp || now
  };

  const updates = {};
  // 1. Thread messages under /chats/{itemId}/{msgId}
  updates[`chats/${messageData.itemId}/${msgId}`] = fullMsg;

  // 2. Real-time receiver inbox notification under /user_inbox/{receiverId}/{msgId}
  if (messageData.receiverId && messageData.receiverId !== messageData.senderId) {
    updates[`user_inbox/${messageData.receiverId}/${msgId}`] = fullMsg;
  }

  // 3. User threads summary for both participants
  const threadSummary = {
    itemId: messageData.itemId,
    itemTitle: messageData.itemTitle || 'Item',
    itemEmoji: messageData.itemEmoji || '📦',
    lastMessage: messageData.text,
    lastSenderName: messageData.senderName,
    lastSenderId: messageData.senderId,
    timestamp: now,
    time: messageData.time
  };

  if (messageData.senderId) {
    updates[`user_threads/${messageData.senderId}/${messageData.itemId}`] = {
      ...threadSummary,
      otherPartyId: messageData.receiverId || '',
      otherPartyName: messageData.receiverName || 'User'
    };
  }
  if (messageData.receiverId && messageData.receiverId !== messageData.senderId) {
    updates[`user_threads/${messageData.receiverId}/${messageData.itemId}`] = {
      ...threadSummary,
      otherPartyId: messageData.senderId || '',
      otherPartyName: messageData.senderName || 'User',
      unread: true
    };
  }

  try {
    await firebaseRtdb.ref().update(updates);
    return fullMsg;
  } catch(err) {
    console.warn('[Clubr RTDB Chat Send Error]', err.message);
    try {
      await firebaseRtdb.ref(`chats/${messageData.itemId}/${msgId}`).set(fullMsg);
      if (messageData.receiverId) {
        firebaseRtdb.ref(`user_inbox/${messageData.receiverId}/${msgId}`).set(fullMsg).catch(()=>{});
      }
      return fullMsg;
    } catch(e) {
      return null;
    }
  }
}

/**
 * Listen for live messages in a specific item chat thread
 */
function clubrListenThreadMessages(itemId, callback) {
  if (!firebaseRtdb || !itemId || typeof callback !== 'function') return () => {};
  const ref = firebaseRtdb.ref(`chats/${itemId}`);
  const handler = (snapshot) => {
    const val = snapshot.val();
    if (val && typeof val === 'object') {
      const msgs = Object.values(val);
      msgs.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
      callback(msgs);
    } else {
      callback([]);
    }
  };
  ref.on('value', handler);
  return () => {
    try { ref.off('value', handler); } catch(e) {}
  };
}

/**
 * Listen for real-time incoming messages for the active user (Global Inbox)
 */
function clubrListenUserInbox(userId, callback) {
  if (!firebaseRtdb || !userId || typeof callback !== 'function') return () => {};
  const ref = firebaseRtdb.ref(`user_inbox/${userId}`);
  const handler = (snapshot) => {
    const msg = snapshot.val();
    if (msg && msg.senderId !== userId) {
      callback(msg);
    }
  };
  ref.on('child_added', handler);
  return () => {
    try { ref.off('child_added', handler); } catch(e) {}
  };
}

function clubrClearUserInboxMessage(userId, msgId) {
  if (!firebaseRtdb || !userId || !msgId) return;
  firebaseRtdb.ref(`user_inbox/${userId}/${msgId}`).remove().catch(()=>{});
}

/**
 * Fetch all chat threads for a user from cloud (for mobile/dashboard restoration)
 */
async function clubrSyncUserChatsFromCloud(userId, userListings = []) {
  if (!firebaseRtdb || !userId) return {};
  const restoredChats = {};
  
  // 1. Check user_threads
  try {
    const snap = await firebaseRtdb.ref(`user_threads/${userId}`).once('value');
    const threads = snap.val();
    if (threads && typeof threads === 'object') {
      for (const itemId of Object.keys(threads)) {
        try {
          const chatSnap = await firebaseRtdb.ref(`chats/${itemId}`).once('value');
          const msgsVal = chatSnap.val();
          if (msgsVal && typeof msgsVal === 'object') {
            const list = Object.values(msgsVal);
            list.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
            restoredChats[itemId] = list;
          }
        } catch(e) {}
      }
    }
  } catch(e) {}

  // 2. Also check all listings owned by this user
  if (Array.isArray(userListings) && userListings.length > 0) {
    for (const item of userListings) {
      if (item && item.id && !restoredChats[item.id]) {
        try {
          const chatSnap = await firebaseRtdb.ref(`chats/${item.id}`).once('value');
          const msgsVal = chatSnap.val();
          if (msgsVal && typeof msgsVal === 'object') {
            const list = Object.values(msgsVal);
            list.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
            if (list.length > 0) {
              restoredChats[item.id] = list;
            }
          }
        } catch(e) {}
      }
    }
  }

  // 3. Also check user_inbox directly to capture any pending messages
  try {
    const inboxSnap = await firebaseRtdb.ref(`user_inbox/${userId}`).once('value');
    const inboxVal = inboxSnap.val();
    if (inboxVal && typeof inboxVal === 'object') {
      for (const m of Object.values(inboxVal)) {
        if (m && m.itemId) {
          if (!restoredChats[m.itemId]) restoredChats[m.itemId] = [];
          if (!restoredChats[m.itemId].some(x => x.id === m.id)) {
            restoredChats[m.itemId].push(m);
            restoredChats[m.itemId].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
          }
        }
      }
    }
  } catch(e) {}

  return restoredChats;
}

/**
 * Programmatic pleasant audio chime for incoming messages
 */
function clubrPlayNotificationChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    // Friendly two-tone chime (880Hz -> 1320Hz)
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.12);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.start(now);
    osc.stop(now + 0.36);
  } catch(e) {}
}
