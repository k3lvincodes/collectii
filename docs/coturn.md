# Self-Hosted Coturn Implementation Guide

**Goal**: Set up a self-hosted Coturn (TURN/STUN) server to ensure reliable WebRTC video/audio calls for users behind firewalls or NAT.

## Prerequisites
- A **Cloud VPS** (Virtual Private Server) with a public IP address.
  - Providers: DigitalOcean ($4/mo), Hetzner ($5/mo), AWS EC2 (t2.micro), or similar.
  - OS: Ubuntu 22.04 LTS (recommended).
- A **Domain Name** (e.g., `turn.yourdomain.com`) pointing to the VPS IP.

## 1. Server Setup & Installation
We will use a standard Linux environment to run the Coturn service.

### Steps
1.  **Update System**: Ensure all packages are up to date.
2.  **Install Coturn**: Use `apt-get` to install the package.
3.  **Enable Service**: Configure it to start on boot.

## 2. SSL/TLS Configuration (Critical)
WebRTC in browsers requires secure connections (HTTPS). Therefore, the TURN server ideally needs TLS (TURNS) support to avoid blocking by strict firewalls.

### Steps
1.  **Install Certbot**: To get a free Let's Encrypt certificate.
2.  **Generate Certificate**: Create a cert for `turn.yourdomain.com`.
3.  **Permission Fix**: Ensure the `turnserver` user can read the certificates.

## 3. Coturn Configuration
We need to edit `/etc/turnserver.conf` to define the behavior.
- **Listening Port**: 3478 (UDP/TCP) and 5349 (TLS).
- **Realm**: The domain name.
- **User/Auth**: Set up a static user or (better) time-limited credentials mechanism (REST API auth). *For simplicity initially, we will use a static secret.*

## 4. Frontend Integration
Update the frontend `createPeerConnection` logic to point to the new server.

### Code Change
```javascript
const pc = new RTCPeerConnection({
    iceServers: [
        { urls: 'stun:turn.yourdomain.com:5349' },
        { 
            urls: 'turn:turn.yourdomain.com:5349',
            username: 'your-user',
            credential: 'your-password'
        }
    ]
});
```

## 5. Testing
- Use [Trickle ICE](https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/) to verify the server is reachable and generating "relay" candidates.

## 6. (Optional) Docker Alternative
If you prefer Docker, we can provide a `docker-compose.yml` to spin this up instantly.
