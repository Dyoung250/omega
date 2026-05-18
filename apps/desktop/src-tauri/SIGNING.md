# Code Signing & Auto-Update Setup

## 1. Generate Tauri Signing Keys

```bash
cd apps/desktop
npx tauri signer generate
```

This creates:
- `private.key` — **NEVER commit this**
- `public.key` — paste this into `tauri.conf.json` as `pubkey`

Add these to GitHub Secrets:
- `TAURI_SIGNING_PRIVATE_KEY` — base64 of `private.key`
- `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` — password if you set one

## 2. Windows Code Signing (EV Certificate)

Purchase an EV code signing certificate from:
- Sectigo, DigiCert, or GlobalSign

Set GitHub Secrets:
- `WINDOWS_CERTIFICATE` — base64 of `.pfx`
- `WINDOWS_CERTIFICATE_PASSWORD`

Update `tauri.conf.json`:
```json
"bundle": {
  "windows": {
    "certificateThumbprint": "YOUR_THUMBPRINT"
  }
}
```

## 3. macOS Code Signing (Apple Developer)

Requires Apple Developer account ($99/yr).

1. Create a Developer ID Application certificate in Apple Developer Portal
2. Download and export as `.p12` with password

Set GitHub Secrets:
- `APPLE_CERTIFICATE` — base64 of `.p12`
- `APPLE_CERTIFICATE_PASSWORD`
- `APPLE_SIGNING_IDENTITY` — e.g. `Developer ID Application: Your Name (TEAMID)`
- `APPLE_ID` — your Apple ID email
- `APPLE_PASSWORD` — app-specific password
- `APPLE_TEAM_ID` — your 10-char team ID

## 4. Updater Endpoint

The updater checks:
```
https://forgia.app/api/updater/{{target}}/{{current_version}}
```

You need to implement this API endpoint on your server. It should return JSON matching the format in `updater.json`.

For static hosting, you can also use a GitHub Release with the `tauri-apps/tauri-action` which handles this automatically.

## 5. Publish a Release

```bash
git tag v0.1.1
git push origin v0.1.1
```

GitHub Actions will build, sign, and publish the release automatically.
