"use client";

import { useState } from "react";
import { ProductMock, type ProductMockProps } from "@/components/product-mock";

export function LivePreview(props: ProductMockProps) {
  const [tilt, setTilt] = useState({ x: 6, y: -10 });

  return (
    <div
      className="relative overflow-hidden rounded-[1.7rem]"
      onMouseMove={(event) => {
        const box = event.currentTarget.getBoundingClientRect();
        const px = (event.clientX - box.left) / box.width;
        const py = (event.clientY - box.top) / box.height;
        setTilt({ x: (0.5 - py) * 14, y: (px - 0.5) * 20 });
      }}
      onMouseLeave={() => setTilt({ x: 6, y: -10 })}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(255,255,255,0.14),transparent_40%),linear-gradient(180deg,#3a322c,#14110f)]" />
      <div className="absolute inset-x-[12%] bottom-[7%] h-8 rounded-[100%] bg-black/45 blur-xl" />
      <div
        className="relative px-3 pb-5 pt-2 will-change-transform"
        style={{
          transform: `perspective(920px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <ProductMock {...props} studio />
      </div>
    </div>
  );
}
