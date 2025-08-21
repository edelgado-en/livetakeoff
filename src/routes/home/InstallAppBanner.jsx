import { useEffect, useState } from "react";

const STORAGE_KEY = "appBanner.hideUntil";
const SNOOZE_DAYS = 7;

function isIOS() {
  const ua = navigator.userAgent || navigator.vendor || window.opera || "";
  const classicIOS = /iPad|iPhone|iPod/i.test(ua);
  // iPadOS 13+ can report as "MacIntel" but with touch support
  const iPadOS13Plus =
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return classicIOS || iPadOS13Plus;
}

function isInStandaloneMode() {
  // iOS Safari: navigator.standalone
  // PWA display-mode: standalone
  const pwaStandalone = window.matchMedia?.(
    "(display-mode: standalone)"
  )?.matches;
  const iosStandalone = navigator.standalone === true;
  return Boolean(pwaStandalone || iosStandalone);
}

function withinSnoozePeriod() {
  try {
    const hideUntil = localStorage.getItem(STORAGE_KEY);
    if (!hideUntil) return false;
    return Date.now() < Number(hideUntil);
  } catch {
    return false;
  }
}

function setSnooze(days = SNOOZE_DAYS) {
  try {
    const until = Date.now() + days * 24 * 60 * 60 * 1000;
    localStorage.setItem(STORAGE_KEY, String(until));
  } catch {
    /* ignore */
  }
}

export default function InstallAppBanner({
  appStoreUrl, // e.g. 'https://apps.apple.com/app/id1234567890'
  appSchemeUrl, // e.g. 'livetakeoff://jobs'
  className = "",
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isIOS() && !isInStandaloneMode() && !withinSnoozePeriod()) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  const handleDownloadClick = () => {
    // Try to open the app
    const now = Date.now();
    window.location.href = appSchemeUrl;

    // If the app isn’t installed, redirect to the App Store after ~800ms
    setTimeout(() => {
      if (Date.now() - now < 2000) {
        window.location.href = appStoreUrl;
      }
    }, 800);
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-50">
      <div className="mx-auto max-w-screen-md px-4 pb-4">
        <div
          className={`rounded-xl bg-white shadow-lg ring-1 ring-gray-200
                         p-4 items-center justify-between ${className}`}
        >
          <div className="flex items-center gap-3">
            <img
              src="/apple-touch-icon.png"
              alt="App icon"
              className="h-10 w-10 rounded-lg border border-gray-200"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div>
              <div className="text-sm font-semibold text-gray-900">
                Get the LiveTakeoff iOS app
              </div>
              <div className="text-xs text-gray-500">
                Faster access and a better mobile experience.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={handleDownloadClick}
              className="inline-flex items-center rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white hover:bg-gray-800"
            >
              Open App
            </button>
            <button
              onClick={() => {
                setSnooze();
                setShow(false);
              }}
              className="text-xs text-gray-500 hover:text-gray-700 px-2 py-2"
              aria-label="Not now"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
