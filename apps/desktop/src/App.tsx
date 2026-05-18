import { Canvas } from "@react-three/fiber";
import { Grid, Environment } from "@react-three/drei";
import Scene from "./components/Scene";
import Layout from "./components/Layout";
import Editor2D from "./components/Editor2D";
import AIScan from "./components/AIScan";
import CameraController from "./components/CameraController";
import ExportBridge from "./components/ExportBridge";
import { useSceneStore, HDRI_PRESETS } from "./stores/sceneStore";
import { Component, ReactNode } from "react";

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: any) {
    console.error("APP CRASH:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div className="p-5 bg-forge-900 text-red-400 font-mono">
          <h2>App Crashed</h2>
          <pre>{this.state.error.stack || this.state.error.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function EnvWrapper() {
  const activeHDRI = useSceneStore((s) => s.activeHDRI);
  const preset = HDRI_PRESETS.find((h) => h.id === activeHDRI)?.preset || "warehouse";
  return <Environment preset={preset as any} />;
}

function Viewport3D() {
  return (
    <Canvas
      shadows
      camera={{ position: [3, 3, 3], fov: 45 }}
      gl={{ antialias: true, toneMapping: 3 }}
      className="w-full h-full"
    >
      <color attach="background" args={["#0a0a0b"]} />
      <fog attach="fog" args={["#0a0a0b", 10, 40]} />
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={2048}
      />
      <EnvWrapper />
      <Scene />
      <Grid
        infiniteGrid
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#2e2e34"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#3a3a42"
        fadeDistance={30}
        fadeStrength={1}
      />
      <CameraController />
      <ExportBridge />
    </Canvas>
  );
}

export default function App() {
  const viewMode = useSceneStore((s) => s.viewMode);

  const renderViewport = () => {
    if (viewMode === "3d") return <Viewport3D />;
    if (viewMode === "2d-top") return <Editor2D />;
    return <AIScan />;
  };

  return (
    <ErrorBoundary>
      <Layout>
        {renderViewport()}
      </Layout>
    </ErrorBoundary>
  );
}
