// Apple OAuth configuration and functions
class AppleOAuth {
  constructor() {
    this.clientId = import.meta.env.VITE_APPLE_CLIENT_ID;
    this.redirectUri = import.meta.env.VITE_APPLE_REDIRECT_URI || window.location.origin;
  }

  async signIn() {
    try {
      // Apple Sign-In uses a popup or redirect flow
      // For this implementation, we'll use a popup approach
      const authUrl = this.buildAuthUrl();
      
      return new Promise((resolve, reject) => {
        const popup = window.open(
          authUrl,
          'apple-oauth',
          'width=500,height=600,scrollbars=yes,resizable=yes'
        );

        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            reject(new Error('Apple OAuth popup was closed'));
          }
        }, 1000);

        // Listen for messages from the popup
        const messageHandler = (event) => {
          if (event.origin !== window.location.origin) return;
          
          if (event.data.type === 'APPLE_OAUTH_SUCCESS') {
            clearInterval(checkClosed);
            window.removeEventListener('message', messageHandler);
            popup.close();
            resolve(event.data.token);
          } else if (event.data.type === 'APPLE_OAUTH_ERROR') {
            clearInterval(checkClosed);
            window.removeEventListener('message', messageHandler);
            popup.close();
            reject(new Error(event.data.error));
          }
        };

        window.addEventListener('message', messageHandler);
      });
    } catch (error) {
      throw new Error(`Apple OAuth failed: ${error.message}`);
    }
  }

  buildAuthUrl() {
    const params = new URLSearchParams({
      response_type: 'code id_token',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: 'name email',
      response_mode: 'form_post',
      state: this.generateState(),
    });

    return `https://appleid.apple.com/auth/authorize?${params.toString()}`;
  }

  generateState() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  // Alternative method using Apple's Sign-In JS SDK
  async signInWithSDK() {
    try {
      // Load Apple Sign-In SDK
      if (!window.AppleID) {
        await this.loadAppleSDK();
      }

      return new Promise((resolve, reject) => {
        const appleId = new window.AppleID({
          clientId: this.clientId,
          scope: 'name email',
          redirectURI: this.redirectUri,
          state: this.generateState(),
        });

        appleId.signIn()
          .then((response) => {
            if (response.authorization) {
              resolve(response.authorization.id_token);
            } else {
              reject(new Error('No authorization token received'));
            }
          })
          .catch((error) => {
            reject(new Error(error.message));
          });
      });
    } catch (error) {
      throw new Error(`Apple OAuth failed: ${error.message}`);
    }
  }

  async loadAppleSDK() {
    return new Promise((resolve, reject) => {
      if (window.AppleID) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
      script.async = true;
      script.onload = resolve;
      script.onerror = () => reject(new Error('Failed to load Apple Sign-In SDK'));
      document.head.appendChild(script);
    });
  }
}

export const appleOAuth = new AppleOAuth(); 