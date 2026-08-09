export function ProductStrike() {
  return (
    <svg className="product-hero__strike" viewBox="0 0 300 22" aria-hidden="true">
      <defs>
        <filter id="product-chalk" x="-4%" y="-30%" width="108%" height="160%">
          <feTurbulence baseFrequency="0.045 0.5" numOctaves="2" seed="8" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" />
        </filter>
      </defs>
      <path className="product-hero__strike-main" d="M7 16 C84 14, 192 10, 293 5" filter="url(#product-chalk)" />
      <path className="product-hero__strike-soft" d="M10 7 C92 10, 205 14, 288 18" filter="url(#product-chalk)" />
    </svg>
  )
}
