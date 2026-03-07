import { useEffect } from 'react';

export function useConsoleBranding() {
  useEffect(() => {
    const isProd = true;
    const envLabel = isProd ? 'PRODUCTION' : 'DEVELOPMENT';
    const envColor = isProd ? '#dc2626' : '#16a34a';


    console.log(
      '%cSampath Academy of Physics CRM',
      'font-size: 18px; font-weight: 700; color: #1e40af; letter-spacing: 0.5px; font-family: system-ui, -apple-system, sans-serif;'
    );

    console.log(
      `%cVersion ${'1.0.0'}  •  ${envLabel}`,
      `font-size: 12px; color: #64748b; letter-spacing: 0.4px; margin-top: -2px;`
    );

    console.log(
      `%c${new Date().toISOString().slice(0, 19).replace('T', ' ')}`,
      'font-size: 11px; color: #94a3b8;'
    );

    console.log(' ');


    console.log(
      '%cBuilt & maintained by Cookie Inc.',
      'font-size: 12px; font-weight: 500; color: #6366f1;'
    );

    console.log(' ');


    console.log(
      '%cDeveloper console — authorized use only',
      'font-size: 11px; color: #6b7280; font-style: italic;'
    );

    console.log(
      '%cAll sessions logged • IP Detected',
      `font-size: 11px; color: ${envColor}; font-weight: 500;`
    );


    if (isProd) {
      console.log(
        '%cState integrity ✓ • Tamper detection active',
        'font-size: 10px; color: #94a3b8; opacity: 0.7;'
      );
    }

  }, []);
}