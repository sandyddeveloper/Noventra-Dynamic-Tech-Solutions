// Replace with your real VAPID public key (Base64 URL-safe)
const VAPID_PUBLIC_KEY = "YOUR_PUBLIC_VAPID_KEY_HERE";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; i += 1) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export async function enablePushNotifications() {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
        alert("Push notifications are not supported in this browser.");
        return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
        alert("Notifications permission denied.");
        return;
    }

    const registration = await navigator.serviceWorker.ready;

    const existing = await registration.pushManager.getSubscription();
    if (existing) {
        console.log("Existing subscription:", JSON.stringify(existing));
        return existing;
    }

    const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
    });

    console.log("New push subscription:", JSON.stringify(sub));
    return sub;
}
