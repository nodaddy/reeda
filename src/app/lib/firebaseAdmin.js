import admin from "firebase-admin";

if(!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            client_email: process.env.FIREBASE_CLIENT_EMAIL, // Fix: Correct property name
            private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"), // Ensure newlines are correctly replaced
            type: process.env.FIREBASE_TYPE,
            private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
            client_id: process.env.FIREBASE_CLIENT_ID,
            auth_uri: process.env.FIREBASE_AUTH_URI,
            token_uri: process.env.FIREBASE_TOKEN_URI,
            auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
            client_x509_cert_url: process.env.FIREBASE_CERT_URL,
            universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
        }),
    });
}

export const adminAuth = admin.auth();
export const adminDB = admin.firestore();
export const messaging = admin.messaging();
export default admin;
