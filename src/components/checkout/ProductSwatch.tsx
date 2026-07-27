interface ProductSwatchProps {
  accentColor: string;
  initials: string;
  size?: number;
}

/**
 * The site has no product photography (it's an abstract 3D room),
 * so cart/checkout line items use a branded color swatch + monogram
 * instead of a thumbnail image.
 */
export function ProductSwatch({ accentColor, initials, size = 64 }: ProductSwatchProps) {
  return (
    <div
      className="relative shrink-0 flex items-center justify-center rounded-sm border border-[#c9a96e]/25"
      style={{ width: size, height: size, backgroundColor: accentColor }}
    >
      <span
        className="font-display text-[#c9a96e] tracking-[0.1em]"
        style={{ fontSize: size * 0.28 }}
      >
        {initials}
      </span>
      <div className="absolute inset-0 rounded-sm ring-1 ring-inset ring-[#c9a96e]/10" />
    </div>
  );
}
