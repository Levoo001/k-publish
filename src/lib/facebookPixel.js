export const FACEBOOK_PIXEL_ID =
  process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || "989309170219411";

export function trackFacebookEvent(eventName, params = {}) {
  if (typeof window === "undefined") return;
  if (typeof window.fbq !== "function") return;

  window.fbq("track", eventName, params);
}
