'use client';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'>;

export function DottedSurface({ className, ...props }: DottedSurfaceProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<{
		scene: THREE.Scene;
		camera: THREE.PerspectiveCamera;
		renderer: THREE.WebGLRenderer;
		animationId: number;
	} | null>(null);

	useEffect(() => {
		if (!containerRef.current) return;

		// Premium Mobile/Tablet sizing optimization
		const isMobile = window.innerWidth <= 768;
		const SEPARATION = isMobile ? 120 : 150;
		const AMOUNTX = isMobile ? 30 : 50; 
		const AMOUNTY = isMobile ? 40 : 60;

		const scene = new THREE.Scene();
		// Deep atmospheric void fading out into pitch black
		scene.fog = new THREE.FogExp2(0x0a0a0b, 0.0009);

		const camera = new THREE.PerspectiveCamera(
			75, // Wider FOV for cinematic depth
			window.innerWidth / window.innerHeight,
			1,
			10000,
		);
		// Position camera low, looking across the vast landscape
		camera.position.set(0, 300, 1000);

		const renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: isMobile ? false : true, // Opt-out antialiasing on weak mobile GPUs
			powerPreference: "high-performance"
		});
		
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap at 2 for mobile heat reduction
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setClearColor(0x000000, 0); // Fully transparent background

		containerRef.current.appendChild(renderer.domElement);

		const positions: number[] = [];
		const colors: number[] = [];
		const scales: number[] = [];

		const geometry = new THREE.BufferGeometry();

		// Base colors representing deep space vs electric lime peaks
		const colorVoid = new THREE.Color(0x050505); // Deep muted green-black
		const colorPeak = new THREE.Color(0xa855f7); // Deep Blue

		for (let ix = 0; ix < AMOUNTX; ix++) {
			for (let iy = 0; iy < AMOUNTY; iy++) {
				const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
				const y = 0; // Animated below
				const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
				positions.push(x, y, z);
                
                // Initialize flat colors (0.0 to 1.0 mapping, not 0-255)
				colors.push(colorVoid.r, colorVoid.g, colorVoid.b);
				scales.push(1);
			}
		}

		geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
		geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
		geometry.setAttribute('scale', new THREE.Float32BufferAttribute(scales, 1));

		// Bulletproof native Material - Guarantees mobile GPU compatibility!
		const material = new THREE.PointsMaterial({
			size: 8,
			vertexColors: true,
			transparent: true,
			opacity: 0.9,
			sizeAttenuation: true,
			depthWrite: false,
			blending: THREE.AdditiveBlending
		});

		const points = new THREE.Points(geometry, material);
		scene.add(points);

		let animationId: number;
		let count = 0;

		const animate = () => {
			animationId = requestAnimationFrame(animate);

            const positionAttribute = geometry.attributes.position;
            const positions = positionAttribute.array as Float32Array;
            const colorAttribute = geometry.attributes.color;
            const colorArray = colorAttribute.array as Float32Array;

            let i = 0;
            for (let ix = 0; ix < AMOUNTX; ix++) {
                for (let iy = 0; iy < AMOUNTY; iy++) {
                    const index = i * 3;
                    
                    // Complex premium liquid sine interference
                    const wave1 = Math.sin((ix + count * 0.8) * 0.3) * 60.0;
                    const wave2 = Math.cos((iy - count * 0.6) * 0.4) * 60.0;
                    const wave3 = Math.sin((ix + iy + count * 0.4) * 0.2) * 40.0;
                    
                    const newY = wave1 + wave2 + wave3;
                    positions[index + 1] = newY;

                    // Calculate color interpolation based on height peak mapping
                    // newY theoretically fluctuates between roughly -160 to +160
                    let blendPct = (newY + 60) / 200; 
                    blendPct = Math.max(0, Math.min(1, blendPct * 1.5)); // smoothstep rough approx

                    // Interpolate RGB actively in Javascript
                    colorArray[index] = colorVoid.r + (colorPeak.r - colorVoid.r) * blendPct;
                    colorArray[index + 1] = colorVoid.g + (colorPeak.g - colorVoid.g) * blendPct;
                    colorArray[index + 2] = colorVoid.b + (colorPeak.b - colorVoid.b) * blendPct;

                    i++;
                }
            }

            positionAttribute.needsUpdate = true;
            colorAttribute.needsUpdate = true;

            // Slower dramatic panning camera
            camera.position.x = Math.sin(count * 0.1) * 200;
            camera.lookAt(0, -100, 0);

			renderer.render(scene, camera);
            count += 0.05;
		};

		const handleResize = () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		};

		window.addEventListener('resize', handleResize);
		animate();

		sceneRef.current = { scene, camera, renderer, animationId };

		return () => {
			window.removeEventListener('resize', handleResize);

			if (sceneRef.current) {
				cancelAnimationFrame(sceneRef.current.animationId);
				sceneRef.current.scene.traverse((object) => {
					if (object instanceof THREE.Points) {
						object.geometry.dispose();
						if (Array.isArray(object.material)) {
							object.material.forEach((mat) => mat.dispose());
						} else {
							object.material.dispose();
						}
					}
				});

				sceneRef.current.renderer.dispose();
				if (containerRef.current && sceneRef.current.renderer.domElement) {
					containerRef.current.removeChild(sceneRef.current.renderer.domElement);
				}
			}
		};
	}, []);

	return (
		<div
			ref={containerRef}
			className={cn(
                'pointer-events-none fixed inset-0 -z-50', 
                className
            )}
            style={{
                // Match the visual masking of EntropyBackground so text stays readable
                maskImage: 'linear-gradient(to bottom, black 50%, transparent 95%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 95%)',
            }}
			{...props}
		/>
	);
}
