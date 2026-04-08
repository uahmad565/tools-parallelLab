import { type CSSProperties, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import './AuthFlowsLearning.css';

type Actor = 'browser' | 'server' | 'database' | 'provider';
type Side = 'left' | 'right';
type Direction = 'left-to-right' | 'right-to-left' | 'down';
type HeroNode = 'client' | 'primary' | 'secondary';

type FlowStep = {
  id: string;
  title: string;
  actor: Actor;
  actorLabel: string;
  side: Side;
  sideLabel: string;
  request: string[];
  explanation: string;
  note: string;
  direction: Direction;
  motion: {
    from: HeroNode;
    to: HeroNode;
  };
};

type FlowDefinition = {
  id: 'password' | 'oauth-external' | 'openid-connect' | 'client-credentials';
  label: string;
  title: string;
  intro: string;
  takeaway: string;
  leftLaneLabel: string;
  rightLaneLabel: string;
  heroNodes: Record<HeroNode, string>;
  heroNodeMeta: Record<HeroNode, string>;
  steps: FlowStep[];
  requestExample: string;
  responseExample: string;
};

const flows: FlowDefinition[] = [
  {
    id: 'password',
    label: 'Password Login',
    title: 'Password Authentication',
    intro:
      'This is the familiar email-and-password sign-in path. The user proves identity directly to your app, and your backend verifies the password before creating a session.',
    takeaway:
      'Identity is proven directly to your own app, so your server is responsible for password verification and session creation.',
    leftLaneLabel: 'Left: Browser / Client',
    rightLaneLabel: 'Right: App Server / Database',
    heroNodes: {
      client: 'Browser',
      primary: 'App Server',
      secondary: 'Database',
    },
    heroNodeMeta: {
      client: 'User interface',
      primary: 'Your backend',
      secondary: 'Stored credential data',
    },
    steps: [
      {
        id: 'password-collect',
        title: 'User enters credentials',
        actor: 'browser',
        actorLabel: 'Browser / Client',
        side: 'left',
        sideLabel: 'Client side',
        request: ['email', 'password', 'optional csrf token'],
        explanation:
          'The browser collects the login form values. The plain password only exists briefly in the client before being sent over HTTPS.',
        note: 'This step happens in the browser UI before the request leaves the device.',
        direction: 'left-to-right',
        motion: {
          from: 'client',
          to: 'client',
        },
      },
      {
        id: 'password-send',
        title: 'Browser sends login request',
        actor: 'browser',
        actorLabel: 'Browser / Client',
        side: 'left',
        sideLabel: 'Client side',
        request: ['POST /login', 'JSON body', 'HTTPS transport'],
        explanation:
          'The browser sends the submitted credentials to your app server so the backend can verify them.',
        note: 'Transport security comes from HTTPS, not from JWT itself.',
        direction: 'left-to-right',
        motion: {
          from: 'client',
          to: 'primary',
        },
      },
      {
        id: 'password-load',
        title: 'Server loads stored auth data',
        actor: 'server',
        actorLabel: 'Application Server',
        side: 'right',
        sideLabel: 'Server side',
        request: ['find user by email or username', 'load password hash', 'load lockout metadata'],
        explanation:
          'Your app server looks up the account details it needs to verify the submitted password.',
        note: 'The server never needs the original password from storage.',
        direction: 'down',
        motion: {
          from: 'primary',
          to: 'secondary',
        },
      },
      {
        id: 'password-return',
        title: 'Database returns hash and account status',
        actor: 'database',
        actorLabel: 'Database',
        side: 'right',
        sideLabel: 'Server side',
        request: ['hashed password', 'salt', 'user id', 'status flags'],
        explanation:
          'The database returns the stored authentication data so the server can verify the submitted password.',
        note: 'Good systems store salted password hashes, not plain passwords.',
        direction: 'down',
        motion: {
          from: 'secondary',
          to: 'primary',
        },
      },
      {
        id: 'password-verify',
        title: 'Server compares password hash',
        actor: 'server',
        actorLabel: 'Application Server',
        side: 'right',
        sideLabel: 'Server side',
        request: ['hash submitted password', 'compare to stored hash', 'apply rate limits or lockout checks'],
        explanation:
          'The server hashes the submitted password with the correct algorithm and compares the result with the stored hash.',
        note: 'Typical algorithms include bcrypt, scrypt, and Argon2.',
        direction: 'down',
        motion: {
          from: 'primary',
          to: 'primary',
        },
      },
      {
        id: 'password-session',
        title: 'Server creates session or app token',
        actor: 'server',
        actorLabel: 'Application Server',
        side: 'right',
        sideLabel: 'Server side',
        request: ['session cookie or JWT', 'sub', 'exp', 'roles or scopes'],
        explanation:
          'After the password is verified, your app creates a local session so future requests can recognize the user.',
        note: 'At this point your app knows who the user is because it verified the credentials itself.',
        direction: 'right-to-left',
        motion: {
          from: 'primary',
          to: 'client',
        },
      },
    ],
    requestExample: `POST /login HTTP/1.1
Content-Type: application/json

{
  "email": "learner@example.com",
  "password": "correct horse battery staple"
}`,
    responseExample: `{
  "accessToken": "eyJhbGciOi...",
  "expiresIn": 3600,
  "user": {
    "id": "user_42",
    "name": "Learner"
  }
}`,
  },
  {
    id: 'oauth-external',
    label: 'OAuth External Login',
    title: 'OAuth 2.0 Authorization Code Flow',
    intro:
      'This is the common "Sign in with Google, Microsoft, or Facebook" pattern. The provider authenticates the user, then your app exchanges the code and creates its own local session.',
    takeaway:
      'OAuth 2.0 gives your app a secure way to receive delegated tokens; it does not, by itself, explain identity as clearly as OpenID Connect does.',
    leftLaneLabel: 'Left: Browser / Client',
    rightLaneLabel: 'Right: App Server / External Provider',
    heroNodes: {
      client: 'Browser',
      primary: 'Your App',
      secondary: 'Provider',
    },
    heroNodeMeta: {
      client: 'User-facing browser',
      primary: 'Your backend',
      secondary: 'Google, Microsoft, Facebook',
    },
    steps: [
      {
        id: 'oauth-start',
        title: 'User clicks external sign-in',
        actor: 'browser',
        actorLabel: 'Browser / Client',
        side: 'left',
        sideLabel: 'Client side',
        request: ['provider button click', 'state value', 'redirect uri'],
        explanation:
          'The browser starts an external login flow because the user wants the provider to handle sign-in.',
        note: 'This is the familiar social-login entry point.',
        direction: 'left-to-right',
        motion: {
          from: 'client',
          to: 'primary',
        },
      },
      {
        id: 'oauth-redirect',
        title: 'Browser is redirected to the provider',
        actor: 'provider',
        actorLabel: 'External Provider',
        side: 'right',
        sideLabel: 'Provider / Server side',
        request: ['response_type=code', 'client_id', 'redirect_uri', 'scope', 'state'],
        explanation:
          'Your app sends the browser to the external provider with an OAuth authorization request.',
        note: 'The state value helps defend against CSRF attacks.',
        direction: 'left-to-right',
        motion: {
          from: 'primary',
          to: 'secondary',
        },
      },
      {
        id: 'oauth-login',
        title: 'Provider authenticates user and asks consent',
        actor: 'provider',
        actorLabel: 'External Provider',
        side: 'right',
        sideLabel: 'Provider / Server side',
        request: ['provider login screen', 'requested scopes', 'consent decision'],
        explanation:
          'The external provider handles identity verification and any consent screens on its own side.',
        note: 'Your app never sees the provider password.',
        direction: 'down',
        motion: {
          from: 'secondary',
          to: 'secondary',
        },
      },
      {
        id: 'oauth-code',
        title: 'Provider returns an authorization code',
        actor: 'provider',
        actorLabel: 'External Provider',
        side: 'right',
        sideLabel: 'Provider / Server side',
        request: ['authorization code', 'same state value'],
        explanation:
          'The provider redirects the browser back to your app with a short-lived authorization code.',
        note: 'The code is temporary and not the final token.',
        direction: 'right-to-left',
        motion: {
          from: 'secondary',
          to: 'client',
        },
      },
      {
        id: 'oauth-exchange',
        title: 'Your server exchanges the code for tokens',
        actor: 'server',
        actorLabel: 'Application Server',
        side: 'right',
        sideLabel: 'Server side',
        request: ['authorization code', 'client_secret', 'redirect_uri', 'token endpoint call'],
        explanation:
          'Your backend exchanges the code with the provider so the sensitive token request happens server to server.',
        note: 'The client secret stays on the server.',
        direction: 'down',
        motion: {
          from: 'primary',
          to: 'secondary',
        },
      },
      {
        id: 'oauth-session',
        title: 'Your app creates its own local session',
        actor: 'server',
        actorLabel: 'Application Server',
        side: 'right',
        sideLabel: 'Server side',
        request: ['provider user id', 'app user mapping', 'local session cookie or JWT'],
        explanation:
          'After validating the provider response, your app still creates its own local session for normal app usage.',
        note: 'Your app owns authorization inside your own system.',
        direction: 'right-to-left',
        motion: {
          from: 'primary',
          to: 'client',
        },
      },
    ],
    requestExample: `GET https://provider.example.com/authorize
  ?client_id=YOUR_APP_ID
  &redirect_uri=https://your-app.com/auth/callback
  &scope=profile email
  &state=random_csrf_value
  &response_type=code`,
    responseExample: `POST https://provider.example.com/oauth/access_token

{
  "client_id": "YOUR_APP_ID",
  "client_secret": "YOUR_APP_SECRET",
  "code": "AQAB...",
  "redirect_uri": "https://your-app.com/auth/callback"
}`,
  },
  {
    id: 'openid-connect',
    label: 'OpenID Connect',
    title: 'OpenID Connect + OAuth 2.0',
    intro:
      'OpenID Connect makes the sign-in story clearer. OAuth 2.0 still handles delegated authorization, but OpenID Connect adds an ID token so your app can know who the user is.',
    takeaway:
      'OAuth 2.0 is about permission to access resources. OpenID Connect adds identity, so your app can trust who signed in.',
    leftLaneLabel: 'Left: Browser / Client',
    rightLaneLabel: 'Right: App Server / Identity Provider',
    heroNodes: {
      client: 'Browser',
      primary: 'Your App',
      secondary: 'Identity Provider',
    },
    heroNodeMeta: {
      client: 'User-facing browser',
      primary: 'Your backend',
      secondary: 'Identity service',
    },
    steps: [
      {
        id: 'oidc-start',
        title: 'User chooses Sign in',
        actor: 'browser',
        actorLabel: 'Browser / Client',
        side: 'left',
        sideLabel: 'Client side',
        request: ['sign-in button click', 'provider choice', 'start login state'],
        explanation:
          'The browser begins a sign-in journey because the app needs to know who the user is.',
        note: 'This is a human identity flow, not just an API token request.',
        direction: 'left-to-right',
        motion: {
          from: 'client',
          to: 'client',
        },
      },
      {
        id: 'oidc-authorize',
        title: 'Browser is sent to the identity provider',
        actor: 'provider',
        actorLabel: 'Identity Provider',
        side: 'right',
        sideLabel: 'Provider / Server side',
        request: ['response_type=code', 'scope=openid profile email', 'client_id', 'redirect_uri', 'state', 'nonce'],
        explanation:
          'Your app starts an OAuth authorization request that also asks for OpenID Connect scopes like openid.',
        note: 'The openid scope is what upgrades a normal OAuth flow into an OpenID Connect sign-in flow.',
        direction: 'left-to-right',
        motion: {
          from: 'primary',
          to: 'secondary',
        },
      },
      {
        id: 'oidc-login',
        title: 'Identity provider authenticates the user',
        actor: 'provider',
        actorLabel: 'Identity Provider',
        side: 'right',
        sideLabel: 'Provider / Server side',
        request: ['provider session or password', 'MFA if needed', 'consent for scopes'],
        explanation:
          'The identity provider handles the actual identity check and any consent screens.',
        note: 'Your app does not collect the provider password or MFA code.',
        direction: 'down',
        motion: {
          from: 'secondary',
          to: 'secondary',
        },
      },
      {
        id: 'oidc-code',
        title: 'Provider returns an authorization code',
        actor: 'provider',
        actorLabel: 'Identity Provider',
        side: 'right',
        sideLabel: 'Provider / Server side',
        request: ['authorization code', 'same state value', 'browser redirect'],
        explanation:
          'The browser returns to your app with a short-lived authorization code.',
        note: 'The code is still just a temporary handoff, not the final identity proof.',
        direction: 'right-to-left',
        motion: {
          from: 'secondary',
          to: 'client',
        },
      },
      {
        id: 'oidc-exchange',
        title: 'Your app exchanges the code at the token endpoint',
        actor: 'server',
        actorLabel: 'Application Server',
        side: 'right',
        sideLabel: 'Server side',
        request: ['authorization code', 'client_secret', 'redirect_uri', 'POST to token endpoint'],
        explanation:
          'Your backend performs the code exchange so the most sensitive credentials remain on the server.',
        note: 'This is still OAuth 2.0 machinery under the hood.',
        direction: 'down',
        motion: {
          from: 'primary',
          to: 'secondary',
        },
      },
      {
        id: 'oidc-tokens',
        title: 'Provider returns an access token and an ID token',
        actor: 'provider',
        actorLabel: 'Identity Provider',
        side: 'right',
        sideLabel: 'Provider / Server side',
        request: ['access_token', 'id_token', 'token_type', 'expires_in', 'scope'],
        explanation:
          'The provider returns OAuth tokens plus an OpenID Connect ID token. The access token is for APIs, while the ID token is the identity statement about the user.',
        note: 'This is the key OpenID Connect moment.',
        direction: 'down',
        motion: {
          from: 'secondary',
          to: 'primary',
        },
      },
      {
        id: 'oidc-validate',
        title: 'Your app validates the ID token and learns the user identity',
        actor: 'server',
        actorLabel: 'Application Server',
        side: 'right',
        sideLabel: 'Server side',
        request: ['validate iss', 'validate aud', 'validate exp', 'validate nonce', 'read sub, name, email claims'],
        explanation:
          'Your app verifies the ID token signature and claims, then reads the trusted identity data inside it.',
        note: 'This is why OpenID Connect feels like login: it tells your app who signed in.',
        direction: 'down',
        motion: {
          from: 'primary',
          to: 'primary',
        },
      },
      {
        id: 'oidc-session',
        title: 'Your app issues its own session to the browser',
        actor: 'browser',
        actorLabel: 'Browser / Client',
        side: 'left',
        sideLabel: 'Client side',
        request: ['app session cookie or JWT', 'signed-in UI', 'later API requests'],
        explanation:
          'Your app creates its own session so the browser can continue using the app as an authenticated user.',
        note: 'The access token can later be used for protected APIs on behalf of the user.',
        direction: 'right-to-left',
        motion: {
          from: 'primary',
          to: 'client',
        },
      },
    ],
    requestExample: `GET https://identity.example.com/authorize
  ?client_id=web-app-123
  &redirect_uri=https://your-app.com/auth/callback
  &response_type=code
  &scope=openid profile email
  &state=random_csrf_value
  &nonce=random_login_nonce`,
    responseExample: `{
  "access_token": "eyJhbGciOi...",
  "id_token": "eyJhbGciOi...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "openid profile email"
}`,
  },
  {
    id: 'client-credentials',
    label: 'Client Credentials',
    title: 'OAuth 2.0 Client Credentials Flow',
    intro:
      'This is machine-to-machine authentication. There is no human sign-in screen: one application proves its own identity to another system.',
    takeaway:
      'No user is involved here. The authenticated identity is the calling application itself.',
    leftLaneLabel: 'Left: Client Application',
    rightLaneLabel: 'Right: Auth / Resource Server',
    heroNodes: {
      client: 'Client App',
      primary: 'Auth Server',
      secondary: 'Resource API',
    },
    heroNodeMeta: {
      client: 'Calling service',
      primary: 'Authorization service',
      secondary: 'Protected API',
    },
    steps: [
      {
        id: 'cc-prepare',
        title: 'Client application prepares a token request',
        actor: 'browser',
        actorLabel: 'Client Application',
        side: 'left',
        sideLabel: 'Client application',
        request: ['client_id', 'client_secret', 'grant_type=client_credentials', 'scope'],
        explanation:
          'A backend service or daemon prepares a token request to authenticate itself, not a human user.',
        note: 'This is the machine-to-machine branch of OAuth 2.0.',
        direction: 'left-to-right',
        motion: {
          from: 'client',
          to: 'client',
        },
      },
      {
        id: 'cc-send',
        title: 'Client sends the token request',
        actor: 'browser',
        actorLabel: 'Client Application',
        side: 'left',
        sideLabel: 'Client application',
        request: ['POST /oauth/token', 'Authorization: Basic base64(client_id:client_secret)', 'grant_type=client_credentials'],
        explanation:
          'The client sends its own credentials to the authorization server and asks for an access token.',
        note: 'No browser redirect or consent screen is involved.',
        direction: 'left-to-right',
        motion: {
          from: 'client',
          to: 'primary',
        },
      },
      {
        id: 'cc-validate',
        title: 'Authorization server validates the client',
        actor: 'server',
        actorLabel: 'Authorization Server',
        side: 'right',
        sideLabel: 'Authorization server',
        request: ['verify client_id', 'verify client_secret', 'check allowed scopes'],
        explanation:
          'The authorization server confirms that the calling application is trusted and allowed to request the requested scopes.',
        note: 'The identity being authenticated here is the application itself.',
        direction: 'down',
        motion: {
          from: 'primary',
          to: 'primary',
        },
      },
      {
        id: 'cc-issue',
        title: 'Authorization server issues an access token',
        actor: 'server',
        actorLabel: 'Authorization Server',
        side: 'right',
        sideLabel: 'Authorization server',
        request: ['access_token', 'token_type', 'expires_in', 'scope'],
        explanation:
          'After validation, the server returns an access token representing the client application.',
        note: 'There are usually no end-user claims because no end user exists in this flow.',
        direction: 'right-to-left',
        motion: {
          from: 'primary',
          to: 'client',
        },
      },
      {
        id: 'cc-api',
        title: 'Client uses the token to call the protected API',
        actor: 'browser',
        actorLabel: 'Client Application',
        side: 'left',
        sideLabel: 'Client application',
        request: ['Authorization: Bearer <access_token>', 'API request to resource server'],
        explanation:
          'The client includes the access token when calling the API it wants to use.',
        note: 'The token proves the application was authorized to access that resource.',
        direction: 'left-to-right',
        motion: {
          from: 'client',
          to: 'secondary',
        },
      },
      {
        id: 'cc-resource',
        title: 'Resource server validates the token and responds',
        actor: 'server',
        actorLabel: 'Resource Server',
        side: 'right',
        sideLabel: 'Resource server',
        request: ['validate signature or introspect token', 'check scopes', 'return protected data'],
        explanation:
          'The resource server verifies the token and returns the machine-readable response if the client is allowed.',
        note: 'This is common for backend integrations and internal APIs.',
        direction: 'right-to-left',
        motion: {
          from: 'secondary',
          to: 'client',
        },
      },
    ],
    requestExample: `POST /oauth/token HTTP/1.1
Authorization: Basic base64(client_id:client_secret)
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&scope=read:reports`,
    responseExample: `{
  "access_token": "eyJhbGciOi...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "read:reports"
}`,
  },
];

const mentalModelCards: Array<{
  title: string;
  summary: string;
  detail: string;
  accent: string;
  badge: string;
  tone: 'blue' | 'violet' | 'sky';
  featured?: boolean;
}> = [
  {
    title: 'Authentication',
    summary: 'Answers "who is this?"',
    detail:
      'Authentication proves identity. A password login proves identity to your app directly, while OIDC lets an identity provider prove it and pass trusted claims back to your app.',
    accent: 'Identity should become trustworthy before anything else.',
    badge: 'ID',
    tone: 'blue',
    featured: true,
  },
  {
    title: 'Authorization',
    summary: 'Answers "what can this app access?"',
    detail:
      'OAuth 2.0 is primarily about delegated authorization. It gives clients a safe way to obtain and use access tokens for protected resources.',
    accent: 'This is the permission layer for APIs and protected resources.',
    badge: 'API',
    tone: 'violet',
  },
  {
    title: 'OpenID Connect',
    summary: 'Adds identity on top of OAuth 2.0',
    detail:
      'OIDC reuses OAuth 2.0 authorization mechanics but introduces the ID token so your app can trust who the user is, not just what resource can be called.',
    accent: 'This is the bridge that makes OAuth feel like a real sign-in flow.',
    badge: 'OIDC',
    tone: 'sky',
  },
];

const comparisonCards: Array<{
  heading: string;
  caption: string;
  body: string;
  badge: string;
  tone: 'blue' | 'violet';
}> = [
  {
    heading: 'OAuth 2.0',
    caption: 'Best mental shortcut',
    body: 'OAuth 2.0 is about getting permission to call APIs or protected resources.',
    badge: 'API',
    tone: 'blue',
  },
  {
    heading: 'OpenID Connect',
    caption: 'Best mental shortcut',
    body: 'OpenID Connect is OAuth 2.0 plus identity, so your app can know who signed in.',
    badge: 'LOGIN',
    tone: 'violet',
  },
];

const tokenCards: Array<{
  name: string;
  purpose: string;
  description: string;
  badge: string;
  tone: 'blue' | 'sky' | 'slate';
}> = [
  {
    name: 'Access token',
    purpose: 'For APIs',
    description: 'Sent to protected resources to prove the caller has delegated permission.',
    badge: 'API',
    tone: 'blue',
  },
  {
    name: 'ID token',
    purpose: 'For sign-in identity',
    description: 'Contains trusted identity claims about the authenticated user in OpenID Connect.',
    badge: 'ID',
    tone: 'sky',
  },
  {
    name: 'App session',
    purpose: 'For your own app',
    description: 'Lets your app remember the signed-in state after it finishes the external flow.',
    badge: 'APP',
    tone: 'slate',
  },
];

const heroPointMap: Record<HeroNode, { x: number; y: number }> = {
  client: { x: 18, y: 50 },
  primary: { x: 78, y: 28 },
  secondary: { x: 78, y: 74 },
};

const linkMap: Record<string, string> = {
  'client:primary': 'client-primary',
  'primary:client': 'client-primary',
  'primary:secondary': 'primary-secondary',
  'secondary:primary': 'primary-secondary',
  'client:secondary': 'client-secondary',
  'secondary:client': 'client-secondary',
};

function getLinkKey(from: HeroNode, to: HeroNode) {
  if (from === to) {
    return null;
  }

  return linkMap[`${from}:${to}`] ?? null;
}

function AuthFlowsLearning() {
  const [activeFlowId, setActiveFlowId] = useState<FlowDefinition['id']>('openid-connect');
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const activeFlow = useMemo(
    () => flows.find((flow) => flow.id === activeFlowId) ?? flows[0],
    [activeFlowId],
  );

  useEffect(() => {
    setActiveStep(0);
  }, [activeFlowId]);

  useEffect(() => {
    if (!isPlaying || !activeFlow) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % activeFlow.steps.length);
    }, 3200);

    return () => window.clearInterval(timer);
  }, [activeFlow, isPlaying]);

  const currentStep = activeFlow.steps[activeStep];

  const directionLabel =
    currentStep.direction === 'left-to-right'
      ? 'Request moving left to right'
      : currentStep.direction === 'right-to-left'
        ? 'Response moving right to left'
        : 'Internal backend processing';

  const currentMotion = currentStep.motion;
  const isInternalMotion = currentMotion.from === currentMotion.to;
  const activeLink = getLinkKey(currentMotion.from, currentMotion.to);
  const packetKey = `${activeFlowId}-${currentStep.id}`;
  const flowProgress = ((activeStep + 1) / activeFlow.steps.length) * 100;

  const packetStyle = useMemo<CSSProperties>(() => {
    if (isInternalMotion) {
      return {};
    }

    const from = heroPointMap[currentMotion.from];
    const to = heroPointMap[currentMotion.to];
    const isVertical = from.x === to.x;
    const isDiagonal = from.x !== to.x && from.y !== to.y;
    const duration = isDiagonal ? 1850 : isVertical ? 1500 : 1700;

    return {
      '--auth-packet-from-x': `${from.x}%`,
      '--auth-packet-from-y': `${from.y}%`,
      '--auth-packet-dx': `${to.x - from.x}%`,
      '--auth-packet-dy': `${to.y - from.y}%`,
      '--auth-packet-duration': `${duration}ms`,
    } as CSSProperties;
  }, [currentMotion.from, currentMotion.to, isInternalMotion]);

  const motionSummary = isInternalMotion
    ? `${activeFlow.heroNodes[currentMotion.from]} is handling this step`
    : `${activeFlow.heroNodes[currentMotion.from]} -> ${activeFlow.heroNodes[currentMotion.to]}`;

  const formatStepNumber = (value: number) => String(value).padStart(2, '0');

  const getNodeState = (node: HeroNode) => {
    if (isInternalMotion) {
      return currentMotion.from === node ? 'processing' : '';
    }

    if (currentMotion.from === node) {
      return 'sending';
    }

    if (currentMotion.to === node) {
      return 'receiving';
    }

    return '';
  };

  return (
    <div className="auth-flows-page">
      <Seo
        title="Auth Flows Learning Studio | Parallel Lab Tools"
        description="Learn password auth, OAuth 2.0, OpenID Connect, and client credentials with an interactive flow visualizer inside Parallel Lab Tools."
        path="/auth-flows-learning"
        keywords="OAuth 2.0 tutorial, OpenID Connect tutorial, auth flow visualizer, password login, client credentials flow"
      />

      <section className="auth-flows-hero">
        <div className="auth-flows-hero__grid">
          <div className="auth-flows-hero__copy">
            <span className="auth-flows-eyebrow">Interactive Learning Tool</span>
            <h1>See auth flows the intuitive way.</h1>
            <p className="auth-flows-hero__lead">
              Watch where the browser, your app, and the identity system each do work. Switch
              flows, follow the packet motion, and use the step panel to understand what each
              token or request means.
            </p>

            <div className="auth-flows-switcher">
              {flows.map((flow) => (
                <button
                  key={flow.id}
                  className={`auth-flows-tab ${flow.id === activeFlowId ? 'active' : ''}`}
                  onClick={() => setActiveFlowId(flow.id)}
                >
                  {flow.label}
                </button>
              ))}
            </div>

            <div className="auth-flows-takeaway">
              <span className="auth-flows-takeaway__label">Current learning takeaway</span>
              <strong>{activeFlow.title}</strong>
              <p>{activeFlow.takeaway}</p>
            </div>

            <div className="auth-flows-progress">
              <div className="auth-flows-progress__meta">
                <span>
                  Step {activeStep + 1} of {activeFlow.steps.length}
                </span>
                <span>{Math.round(flowProgress)}%</span>
              </div>
              <div className="auth-flows-progress__bar" aria-hidden="true">
                <span style={{ width: `${flowProgress}%` }} />
              </div>
            </div>

            <div className="auth-flows-hero__actions">
              <button
                className="auth-flows-btn auth-flows-btn--primary"
                onClick={() => setIsPlaying((value) => !value)}
              >
                {isPlaying ? 'Pause animation' : 'Play animation'}
              </button>
              <button
                className="auth-flows-btn auth-flows-btn--secondary"
                onClick={() => setActiveStep(0)}
              >
                Restart flow
              </button>
            </div>
          </div>

          <div className="auth-flow-stage">
            <div className="auth-flow-stage__header">
              <div>
                <span className="auth-flows-eyebrow">Live Stage</span>
                <strong>{currentStep.title}</strong>
              </div>
              <div className="auth-flow-stage__count">
                {formatStepNumber(activeStep + 1)} / {formatStepNumber(activeFlow.steps.length)}
              </div>
            </div>

            <div className="auth-flow-stage__lane auth-flow-stage__lane--left">
              <span>{activeFlow.leftLaneLabel}</span>
            </div>
            <div className="auth-flow-stage__lane auth-flow-stage__lane--right">
              <span>{activeFlow.rightLaneLabel}</span>
            </div>

            <svg
              className="auth-flow-stage__links"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <line
                className={`auth-flow-stage__link ${activeLink === 'client-primary' ? 'active' : ''}`}
                x1="18"
                y1="50"
                x2="78"
                y2="28"
              />
              <line
                className={`auth-flow-stage__link ${activeLink === 'primary-secondary' ? 'active' : ''}`}
                x1="78"
                y1="28"
                x2="78"
                y2="74"
              />
              <line
                className={`auth-flow-stage__link ${activeLink === 'client-secondary' ? 'active' : ''}`}
                x1="18"
                y1="50"
                x2="78"
                y2="74"
              />
            </svg>

            <div className={`auth-node auth-node--client ${getNodeState('client')}`}>
              <span className="auth-node__title">{activeFlow.heroNodes.client}</span>
              <small>{activeFlow.heroNodeMeta.client}</small>
            </div>

            <div className={`auth-node auth-node--primary ${getNodeState('primary')}`}>
              <span className="auth-node__title">{activeFlow.heroNodes.primary}</span>
              <small>{activeFlow.heroNodeMeta.primary}</small>
            </div>

            <div className={`auth-node auth-node--secondary ${getNodeState('secondary')}`}>
              <span className="auth-node__title">{activeFlow.heroNodes.secondary}</span>
              <small>{activeFlow.heroNodeMeta.secondary}</small>
            </div>

            {isInternalMotion ? null : (
              <div
                key={packetKey}
                className={`auth-flow-packet ${currentStep.direction}`}
                style={packetStyle}
                aria-hidden="true"
              >
                <span className="auth-flow-packet__core" />
              </div>
            )}

            <div
              className={`auth-flow-stage__activity ${isInternalMotion ? 'internal' : currentStep.direction}`}
            >
              <span>{isInternalMotion ? 'Internal processing' : directionLabel}</span>
              <strong>{motionSummary}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="auth-flows-card auth-flows-card--padded auth-flows-concepts-section">
        <div className="auth-flows-section-heading">
          <span>Core Mental Model</span>
          <strong>Three ideas that make the rest of the flows easier</strong>
        </div>
        <div className="auth-flows-concepts-grid">
          {mentalModelCards.map((card) => (
            <article
              key={card.title}
              className={`auth-flows-concept-card auth-flows-surface--${card.tone} ${card.featured ? 'auth-flows-concept-card--featured' : ''}`}
            >
              <div className="auth-flows-card-topline">
                <span className="auth-flows-card-badge">{card.badge}</span>
                <span className="auth-flows-card-kicker">{card.summary}</span>
              </div>
              <h2>{card.title}</h2>
              <p>{card.detail}</p>
              <strong className="auth-flows-card-accent">{card.accent}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="auth-flows-layout">
        <div className="auth-flows-card auth-flows-card--padded">
          <div className="auth-flows-section-heading">
            <span>Animated Flow</span>
            <strong>{activeFlow.title}</strong>
          </div>

          <p className="auth-flows-card__intro">{activeFlow.intro}</p>

          <div className="auth-flows-timeline-progress" aria-hidden="true">
            <span style={{ width: `${flowProgress}%` }} />
          </div>

          <div className="auth-flows-lane-header" aria-hidden="true">
            <span>{activeFlow.leftLaneLabel}</span>
            <span>{activeFlow.rightLaneLabel}</span>
          </div>

          <div className={`auth-flows-direction ${currentStep.direction}`}>
            <span className="auth-flows-direction__arrow" />
            <strong>{directionLabel}</strong>
          </div>

          <div className="auth-flows-timeline">
            {activeFlow.steps.map((step, index) => {
              const status =
                index === activeStep ? 'current' : index < activeStep ? 'complete' : 'upcoming';

              return (
                <button
                  key={step.id}
                  className={`auth-flows-step ${status} ${step.side} ${step.direction}`}
                  onClick={() => setActiveStep(index)}
                >
                  <span className="auth-flows-step__side">{step.sideLabel}</span>
                  <span className="auth-flows-step__index">{formatStepNumber(index + 1)}</span>
                  <span className="auth-flows-step__title">{step.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="auth-flows-card auth-flows-card--padded">
          <div className="auth-flows-section-heading">
            <span>Current Step</span>
            <strong>{currentStep.title}</strong>
          </div>

          <div key={packetKey} className="auth-flows-step-panel">
            <div className="auth-flows-step-panel__meta">
              <div className="auth-flows-chip auth-flows-chip--actor">{currentStep.actorLabel}</div>
              <div className="auth-flows-chip auth-flows-chip--counter">
                Step {formatStepNumber(activeStep + 1)} of {formatStepNumber(activeFlow.steps.length)}
              </div>
            </div>

            <div className={`auth-flows-pill auth-flows-pill--side ${currentStep.side}`}>
              {currentStep.sideLabel}
            </div>
            <div className={`auth-flows-pill auth-flows-pill--motion ${currentStep.direction}`}>
              {motionSummary}
            </div>

            <p className="auth-flows-step-panel__text">{currentStep.explanation}</p>

            <div className="auth-flows-request-box">
              <div className="auth-flows-request-box__label">Important data at this step</div>
              <ul>
                {currentStep.request.map((item, index) => (
                  <li key={item} style={{ '--item-index': index } as CSSProperties}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <p className="auth-flows-step-panel__note">{currentStep.note}</p>
          </div>
        </div>
      </section>

      <section className="auth-flows-detail-grid auth-flows-detail-grid--examples">
        <article className="auth-flows-card auth-flows-card--padded auth-flows-card--example auth-flows-card--example-request">
          <div className="auth-flows-section-heading">
            <span>Example Request</span>
            <strong>What gets sent in this flow</strong>
          </div>
          <pre className="auth-flows-code">{activeFlow.requestExample}</pre>
        </article>

        <article className="auth-flows-card auth-flows-card--padded auth-flows-card--example auth-flows-card--example-response">
          <div className="auth-flows-section-heading">
            <span>Example Response</span>
            <strong>What comes back or gets exchanged</strong>
          </div>
          <pre className="auth-flows-code">{activeFlow.responseExample}</pre>
        </article>
      </section>

      <section className="auth-flows-detail-grid auth-flows-detail-grid--insights">
        <article className="auth-flows-card auth-flows-card--padded auth-flows-card--comparison">
          <div className="auth-flows-section-heading">
            <span>OAuth vs OIDC</span>
            <strong>The shortest mental shortcut that stays useful</strong>
          </div>
          <div className="auth-flows-summary-grid">
            {comparisonCards.map((card) => (
              <article
                key={card.heading}
                className={`auth-flows-summary-card auth-flows-surface--${card.tone}`}
              >
                <div className="auth-flows-card-topline">
                  <span className="auth-flows-card-badge">{card.badge}</span>
                  <span className="auth-flows-card-kicker">{card.caption}</span>
                </div>
                <h3>{card.heading}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </article>

        <article className="auth-flows-card auth-flows-card--padded auth-flows-card--tokens">
          <div className="auth-flows-section-heading">
            <span>Token Roles</span>
            <strong>Which token is for what?</strong>
          </div>
          <div className="auth-flows-summary-grid auth-flows-summary-grid--compact auth-flows-summary-grid--tokens">
            {tokenCards.map((card) => (
              <article
                key={card.name}
                className={`auth-flows-summary-card auth-flows-surface--${card.tone}`}
              >
                <div className="auth-flows-card-topline">
                  <span className="auth-flows-card-badge">{card.badge}</span>
                  <span className="auth-flows-card-kicker">{card.purpose}</span>
                </div>
                <h3>{card.name}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="auth-flows-card auth-flows-card--padded auth-flows-footer-cta">
        <div>
          <span className="auth-flows-eyebrow">Keep Exploring</span>
          <h2>Want more interactive learning tools?</h2>
          <p>
            Parallel Lab Tools now includes auth-flow learning alongside exam prep and developer
            utilities.
          </p>
        </div>
        <div className="auth-flows-footer-cta__actions">
          <Link to="/tools" className="auth-flows-link auth-flows-link--primary">
            Browse all tools
          </Link>
          <Link to="/practice-simulators" className="auth-flows-link auth-flows-link--secondary">
            Explore practice exams
          </Link>
        </div>
      </section>
    </div>
  );
}

export default AuthFlowsLearning;
