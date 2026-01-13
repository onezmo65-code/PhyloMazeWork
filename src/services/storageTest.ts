import { FirebaseStorage } from "@capacitor-firebase/storage";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";

export async function signInWithGoogle() {
  try {
    const result = await FirebaseAuthentication.signInWithGoogle();
    return result.user;
  } catch (error) {
    console.error("Sign-in failed:", error);
    throw error;
  }
}

export async function testAdminUpload() {
  try {
    // Fallback for Blob support if needed, or use uploadFile if supported
    // Using uploadFile with Blob as per standard Capacitor 6 plugin
    const file = new Blob(["Hello from admin"], { type: "text/plain" });
    
    // Note: The plugin might require a specific format depending on version.
    // If uploadFile fails with Blob issues, we can switch to uploadString (base64).
    
    const result = await FirebaseStorage.uploadFile({
      path: "public/admin-test.txt",
      file: file,
    });

    return result;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
}
