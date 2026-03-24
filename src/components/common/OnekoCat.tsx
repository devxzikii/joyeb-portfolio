import { catConfig } from '@/config/Cat';
import { useEffect } from 'react';

const ONEKO_SCRIPT_ID = 'oneko-script';

export default function OnekoCat() {
  useEffect(() => {
    if (!catConfig.enabled) {
      return;
    }

    if (typeof document === 'undefined') {
      return;
    }

    if (
      document.getElementById(ONEKO_SCRIPT_ID) ||
      document.getElementById('oneko')
    ) {
      return;
    }

    const script = document.createElement('script');
    script.id = ONEKO_SCRIPT_ID;
    script.src = '/oneko/oneko.js';
    script.async = true;
    script.dataset.cat = '/oneko/oneko.gif';

    document.head.appendChild(script);
  }, []);

  if (!catConfig.enabled) {
    return null;
  }

  return null;
}
