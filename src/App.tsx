import { useState } from "react";
import { MazeGame } from "./components/MazeGame";
import { signInWithGoogle, testAdminUpload } from "./services/storageTest";

function App() {
  const [status, setStatus] = useState<string>("");

  const handleSignIn = async () => {
    try {
      setStatus("Signing in...");
      const user = await signInWithGoogle();
      setStatus(`Signed in as: ${user?.email} (${user?.uid})`);
    } catch (err: any) {
      setStatus(`Sign-in Error: ${err.message}`);
    }
  };

  const handleUpload = async () => {
    try {
      setStatus("Uploading...");
      await testAdminUpload();
      setStatus("✅ Upload successful! Check Storage > Files > public/admin-test.txt");
    } catch (err: any) {
      setStatus(`❌ Upload failed: ${err.message}`);
    }
  };

  return (
    <>
      {/* Admin Panel removed for production */}
      <MazeGame />
    </>
  );
}

export default App;