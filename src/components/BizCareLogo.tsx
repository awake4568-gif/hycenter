import React from 'react';

interface BizCareLogoProps {
  className?: string;
  iconClassName?: string;
  hideText?: boolean;
  light?: boolean;
}

export default function BizCareLogo({ 
  className = '', 
  iconClassName = 'w-12 h-12', 
  hideText = false, 
  light = false 
}: BizCareLogoProps) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* High-Fidelity 3D Metallic Gold Vector Reconstitution of the new logo */}
      <svg
        viewBox="0 0 512 512"
        className={`${iconClassName} shrink-0 transition-transform duration-300 drop-shadow-sm`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="BizCareGoldLogoGroup">
          {/* Subtle outer glow shadow for high end depth */}
          <path
            d="M256 64C320 80 400 96 432 128C432 248 400 368 256 448C112 368 80 248 80 128C112 96 192 80 256 64Z"
            fill="none"
            stroke="url(#goldMetallicDeep)"
            strokeWidth="20"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Inner golden glow contour line */}
          <path
            d="M256 86C310 100 376 114 402 140C402 235 376 332 256 414C136 332 110 235 110 140C136 114 202 100 256 86Z"
            fill="none"
            stroke="url(#goldMetallicLight)"
            strokeWidth="4"
            opacity="0.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 3-Bar Chart of Increasing Height (Growth & Scaling) - Rich gold metallic gradient */}
          <rect x="182" y="255" width="22" height="65" rx="5" fill="url(#goldMetallicBar)" />
          <rect x="232" y="195" width="22" height="125" rx="5" fill="url(#goldMetallicBar)" />
          <rect x="282" y="145" width="22" height="175" rx="5" fill="url(#goldMetallicBar)" />

          {/* Diagnostic Upward Trend Arrow (Breaking through Shield Edge, with 3D metal tip) */}
          <path
            d="M130 330L220 230L275 245L355 135"
            stroke="url(#goldMetallicTrend)"
            strokeWidth="22"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M320 130H360V170"
            stroke="url(#goldMetallicTrend)"
            strokeWidth="22"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Hand Silhouette Supporting & Cradling at Bottom (Representing Trust, Care & Guidance) */}
          <path
            d="M148 346C168 376 208 412 256 422C310 422 360 392 388 346C350 372 308 382 268 382C222 382 182 366 148 346Z"
            fill="url(#goldMetallicHand)"
          />
          <path
            d="M228 376C248 391 284 396 308 386C338 374 374 336 394 290C378 315 352 340 322 350C292 360 258 360 228 376Z"
            fill="url(#goldMetallicHandHighlight)"
            opacity="0.95"
          />
        </g>
        
        {/* Advanced Multi-Stop Metallic Gold Gradients */}
        <defs>
          <linearGradient id="goldMetallicDeep" x1="80" y1="64" x2="432" y2="448" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8A662D" />
            <stop offset="15%" stopColor="#C5A059" />
            <stop offset="30%" stopColor="#F2E3C6" />
            <stop offset="45%" stopColor="#B48E44" />
            <stop offset="60%" stopColor="#FDF6E2" />
            <stop offset="75%" stopColor="#9B783E" />
            <stop offset="90%" stopColor="#D8B26E" />
            <stop offset="100%" stopColor="#5C4416" />
          </linearGradient>

          <linearGradient id="goldMetallicLight" x1="110" y1="86" x2="402" y2="414" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFF4D4" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#AA771C" />
          </linearGradient>

          <linearGradient id="goldMetallicBar" x1="182" y1="145" x2="304" y2="320" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F5E5C9" />
            <stop offset="50%" stopColor="#C9A35D" />
            <stop offset="100%" stopColor="#785923" />
          </linearGradient>

          <linearGradient id="goldMetallicTrend" x1="130" y1="130" x2="360" y2="330" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFF2D6" />
            <stop offset="35%" stopColor="#F5D081" />
            <stop offset="70%" stopColor="#B58F48" />
            <stop offset="100%" stopColor="#F0DDA8" />
          </linearGradient>

          <linearGradient id="goldMetallicHand" x1="148" y1="290" x2="394" y2="422" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#967433" />
            <stop offset="35%" stopColor="#E0B970" />
            <stop offset="70%" stopColor="#FFF3D9" />
            <stop offset="100%" stopColor="#6E501A" />
          </linearGradient>

          <linearGradient id="goldMetallicHandHighlight" x1="228" y1="290" x2="394" y2="386" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFEBBF" />
            <stop offset="50%" stopColor="#DFBA73" />
            <stop offset="100%" stopColor="#9F7E3C" />
          </linearGradient>
        </defs>
      </svg>

      {/* Brand Text Elements (Aligned layout directly referencing the new logo card) */}
      {!hideText && (
        <div className="shrink-0 text-left font-sans flex flex-col justify-center">
          <div className="flex items-start gap-0.5 leading-none">
            <span className={`font-black tracking-tight text-lg md:text-2xl font-sans ${
              light ? 'text-white' : 'text-[#061C3F]'
            }`}>
              BizCare
            </span>
            {/* Registered-mark/dot from original uploaded image */}
            <span className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full mt-1 shrink-0 ${
              light ? 'bg-amber-400' : 'bg-slate-900'
            }`}></span>
          </div>
          
          <span className={`tracking-wider font-extrabold font-mono uppercase text-[8px] md:text-[9.5px] leading-none mt-1 ${
            light ? 'text-blue-300' : 'text-[#0B2F64]'
          }`}>
            Policy Fund Research Institute
          </span>
          
          <span className={`font-extrabold text-[11px] md:text-[13.5px] tracking-tight leading-none mt-1 whitespace-nowrap ${
            light ? 'text-white' : 'text-slate-900'
          }`}>
            비즈케어 정책자금연구소
          </span>
        </div>
      )}
    </div>
  );
}

