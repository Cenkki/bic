"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      render: (container: string | HTMLElement, parameters: any) => string;
    };
  }
}

interface ReCaptchaProps {
  onVerify: (token: string) => void;
}

export default function ReCaptcha({ onVerify }: ReCaptchaProps) {
  const captchaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadReCaptcha = () => {
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => {
          if (captchaRef.current) {
            window.grecaptcha.render(captchaRef.current, {
              sitekey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
              callback: onVerify,
            });
          }
        });
      }
    };

    // Check if grecaptcha is already loaded
    if (window.grecaptcha) {
      loadReCaptcha();
    } else {
      // Load the ReCaptcha script
      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = loadReCaptcha;
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup
      if (captchaRef.current) {
        captchaRef.current.innerHTML = "";
      }
    };
  }, [onVerify]);

  return <div ref={captchaRef} />;
}