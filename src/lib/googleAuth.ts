export interface GoogleUser {
  sub: string;
  name: string;
  email: string;
  picture?: string;
}

/** Decodes the payload of a Google Identity Services JWT credential (no signature verification — for display purposes only). */
export function decodeGoogleCredential(credential: string): GoogleUser | null {
  try {
    const payloadPart = credential.split(".")[1];
    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join(""),
    );
    const payload = JSON.parse(json);
    if (!payload.sub || !payload.email) return null;
    return {
      sub: payload.sub,
      name: payload.name ?? payload.email,
      email: payload.email,
      picture: payload.picture,
    };
  } catch {
    return null;
  }
}

let scriptPromise: Promise<void> | null = null;

export function loadGoogleIdentityScript(): Promise<void> {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Google Identity Services 스크립트를 불러오지 못했습니다."));
    document.head.appendChild(script);
  });

  return scriptPromise;
}
