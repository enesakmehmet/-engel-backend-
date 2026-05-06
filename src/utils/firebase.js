const admin = require('firebase-admin');

let firebaseApp = null;

const normalizePrivateKey = (value) => {
  if (!value) return value;
  return value.replace(/\\n/g, '\n');
};

const getServiceAccountFromEnv = () => {
  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (rawJson) {
    const serviceAccount = JSON.parse(rawJson);
    if (serviceAccount.private_key) {
      serviceAccount.private_key = normalizePrivateKey(serviceAccount.private_key);
    }
    return serviceAccount;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);

  if (projectId && clientEmail && privateKey) {
    return {
      projectId,
      clientEmail,
      privateKey,
    };
  }

  return null;
};

const getFirebaseApp = () => {
  if (firebaseApp) return firebaseApp;

  if (admin.apps.length > 0) {
    firebaseApp = admin.app();
    return firebaseApp;
  }

  const serviceAccount = getServiceAccountFromEnv();
  if (!serviceAccount) {
    throw new Error('Firebase admin configuration missing. Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY.');
  }

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.projectId || serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID,
  });

  return firebaseApp;
};

const verifyFirebaseIdToken = async (idToken) => {
  if (!idToken) {
    throw new Error('Firebase ID token is required');
  }

  const app = getFirebaseApp();
  return admin.auth(app).verifyIdToken(idToken);
};

module.exports = {
  getFirebaseApp,
  verifyFirebaseIdToken,
};
