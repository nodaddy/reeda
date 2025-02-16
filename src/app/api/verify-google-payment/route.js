import { google } from 'googleapis';
import { applicationDefault } from 'google-auth-library';

// Initialize auth with Firebase Admin credentials
const auth = new google.auth.GoogleAuth({
  // Method 1: Using JSON file content
  credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || '{}'),
  scopes: ['https://www.googleapis.com/auth/androidpublisher'],
});

// Alternative Method 2: Using application default credentials
// const auth = applicationDefault({
//   scopes: ['https://www.googleapis.com/auth/androidpublisher']
// });

const androidPublisher = google.androidpublisher({
  version: 'v3',
  auth,
});

export async function POST(req) {
  try {
    // Log authentication details (remove in production)
    console.log('Verifying credentials...');

    const body = await req.json();
    const { packageName, productId, purchaseToken } = body;

    // Log request details
    console.log('Attempting verification for:', {
      packageName,
      productId,
      purchaseToken: purchaseToken ? `${purchaseToken.substring(0, 6)}...` : undefined,
    });

    // Verify auth token first
    try {
      const client = await auth.getClient();
      const token = await client.getAccessToken();
      console.log('Successfully obtained access token:', token.token ? 'Token exists' : 'No token');
    } catch (authError) {
      console.error('Authentication error:', {
        name: authError.name,
        message: authError.message,
      });
      return Response.json(
        { error: 'Authentication failed', details: authError.message },
        { status: 401 }
      );
    }

    // Attempt purchase verification
    const purchase = await androidPublisher.purchases.products.get({
      packageName,
      productId,
      token: purchaseToken,
    });

    console.log('Purchase verification successful:', purchase.data);

    return Response.json({
      success: true,
      purchaseData: purchase.data,
    });

  } catch (error) {
    console.error('Google Play API Error:', {
      name: error.name,
      message: error.message,
      status: error.status,
      response: JSON.stringify(error.response?.data.error.errors),
    });

    return Response.json(
      { 
        error: 'Failed to verify purchase',
        details: error.message
      },
      { status: 500 }
    );
  }
}