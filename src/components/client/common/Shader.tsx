// components/common/Shader.ts
"use client";

import dynamic from 'next/dynamic'
import { ShaderGradientCanvas } from 'shadergradient'

// Disable SSR and only load on client side
const ShaderGradient = dynamic(
  () => import('shadergradient').then((mod) => mod.ShaderGradient),
  { ssr: false }
)

export default function BackgroundShader() {
  return (
    <div className="fixed inset-0 -z-10">
      <ShaderGradientCanvas
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
        }}
        fov={50}
      >
        <ShaderGradient
          type="waterPlane"
          color1="#da94ff"
          color2="#db7da9"
          color3="#b4c3e1"
          uDensity={1.3}
          uFrequency={5.5}
          uSpeed={0.2}
          uStrength={1.6}
          positionX={-0.4}
          positionY={0.1}
          positionZ={0}
          rotationX={0}
          rotationY={0.17}
          rotationZ={0.87}
          envPreset="city"
          brightness={1.1}
          grain="on"
          wireframe={false}
          animate="on"
        />
      </ShaderGradientCanvas>
    </div>
  )
}