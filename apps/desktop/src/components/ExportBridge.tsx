import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { registerScene, registerGL } from "../utils/exportManager";

export default function ExportBridge() {
  const { scene, gl } = useThree();

  useEffect(() => {
    registerScene(scene);
    registerGL(gl);
  }, [scene, gl]);

  return null;
}
