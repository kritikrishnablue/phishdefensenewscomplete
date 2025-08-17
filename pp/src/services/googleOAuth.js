// Google OAuth configuration and functions
class GoogleOAuth {
  constructor() {
    this.clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    this.sdkLoaded = false;
    this.sdkLoadingPromise = null;
  }

  async loadGoogleSDK() {
    if (this.sdkLoaded) return;
    if (this.sdkLoadingPromise) return this.sdkLoadingPromise;

    this.sdkLoadingPromise = new Promise((resolve, reject) => {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        this.sdkLoaded = true;
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.onload = () => {
        this.sdkLoaded = true;
        resolve();
      };
      script.onerror = reject;
      document.body.appendChild(script);
    });
    return this.sdkLoadingPromise;
  }

  async signInWithIdToken() {
    await this.loadGoogleSDK();
    return new Promise((resolve, reject) => {
      if (!window.google || !window.google.accounts || !window.google.accounts.id) {
        reject(new Error('Google SDK not loaded'));
        return;
      }
      window.google.accounts.id.initialize({
        client_id: this.clientId,
        callback: (response) => {
          if (response.credential) {
            resolve(response.credential);
          } else {
            reject(new Error('No credential returned'));
          }
        }
      });
      window.google.accounts.id.prompt();
    });
  }
}

export const googleOAuth = new GoogleOAuth(); 