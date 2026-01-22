"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import * as THREE from "three";

export type AgentState = null | "thinking" | "listening" | "talking";

interface OrbProps {
  colors?: [string, string];
  seed?: number;
  agentState?: AgentState;
  volumeMode?: "auto" | "manual";
  manualInput?: number;
  manualOutput?: number;
  getInputVolume?: () => number;
  getOutputVolume?: () => number;
  className?: string;
  isActive?: boolean;
  isSpeaking?: boolean;
  size?: "small" | "medium" | "large";
}

function AnimatedOrb({
  colors = ["#CADCFC", "#A0B9D1"],
  agentState = null,
  manualInput = 0,
  manualOutput = 0,
  isSpeaking = false,
}: {
  colors: [string, string];
  agentState: AgentState;
  manualInput: number;
  manualOutput: number;
  isSpeaking: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.color1.value = new THREE.Color(colors[0]);
      materialRef.current.uniforms.color2.value = new THREE.Color(colors[1]);
    }
  }, [colors]);

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;

    const time = state.clock.elapsedTime;
    
    // Rotation based on state
    if (agentState === "talking" || isSpeaking) {
      meshRef.current.rotation.x = Math.sin(time * 2) * 0.2;
      meshRef.current.rotation.y += 0.02;
      // Pulsing effect
      const scale = 1 + Math.sin(time * 4) * 0.1;
      meshRef.current.scale.setScalar(scale);
    } else if (agentState === "listening") {
      meshRef.current.rotation.y += 0.01;
      const scale = 1 + Math.sin(time * 2) * 0.05;
      meshRef.current.scale.setScalar(scale);
    } else {
      // Idle state - gentle rotation
      meshRef.current.rotation.y += 0.005;
      meshRef.current.scale.setScalar(1);
    }

    // Update shader uniforms
    materialRef.current.uniforms.time.value = time;
    materialRef.current.uniforms.intensity.value = 
      agentState === "talking" || isSpeaking ? 1.5 : agentState === "listening" ? 1.0 : 0.5;
  });

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform vec3 color1;
    uniform vec3 color2;
    uniform float time;
    uniform float intensity;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      vec3 color = mix(color1, color2, vUv.y + sin(time + vUv.x * 3.0) * 0.2);
      float glow = pow(1.0 - length(vUv - 0.5) * 2.0, 2.0);
      color += glow * intensity * 0.3;
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          color1: { value: new THREE.Color(colors[0]) },
          color2: { value: new THREE.Color(colors[1]) },
          time: { value: 0 },
          intensity: { value: 0.5 },
        }}
      />
    </Sphere>
  );
}

export function Orb({
  colors = ["#2E63CD", "#60A5FA"],
  seed,
  agentState = null,
  volumeMode = "auto",
  manualInput = 0,
  manualOutput = 0,
  getInputVolume,
  getOutputVolume,
  className = "",
  isActive = false,
  isSpeaking = false,
  size = "large",
}: OrbProps) {
  const sizeMap = {
    small: "h-24 w-24",
    medium: "h-32 w-32",
    large: "h-48 w-48",
  };

  return (
    <div className={`relative ${sizeMap[size]} ${className}`}>
      <div className="h-full w-full overflow-hidden rounded-full shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)]">
        <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <AnimatedOrb
            colors={colors}
            agentState={agentState}
            manualInput={manualInput}
            manualOutput={manualOutput}
            isSpeaking={isSpeaking}
          />
        </Canvas>
      </div>
    </div>
  );
}
