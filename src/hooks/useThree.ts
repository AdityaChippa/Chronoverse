import { useThree as useThreeFiber } from '@react-three/fiber';
import { useEffect, useState } from 'react';

export function useThree() {
  const three = useThreeFiber();
  
  return {
    camera: three.camera,
    scene: three.scene,
    gl: three.gl,
    size: three.size,
    viewport: three.viewport,
    clock: three.clock,
  };
}

export function useResponsiveSize() {
  const [scale, setScale] = useState(1);
  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setScale(0.6);
      else if (width < 1024) setScale(0.8);
      else setScale(1);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return scale;
}