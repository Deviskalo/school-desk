import { useState } from "react";
import { storage, ID } from "@appwrite/client";

const BUCKET_ID = "school-logos";

interface UploadState {
  uploading: boolean;
  error: string | null;
}

export function useLogoUpload() {
  const [state, setState] = useState<UploadState>({
    uploading: false,
    error: null,
  });

  /**
   * Uploads a file to the school-logos Appwrite Storage bucket.
   * Returns the public preview URL on success, or null on failure.
   */
  const uploadLogo = async (file: File): Promise<string | null> => {
    setState({ uploading: true, error: null });

    try {
      const response = await storage.createFile(BUCKET_ID, ID.unique(), file);
      // Build the public preview URL
      const endpointBase =
        (import.meta as any).env?.VITE_APPWRITE_ENDPOINT ||
        "https://fra.cloud.appwrite.io/v1";
      const projectId =
        (import.meta as any).env?.VITE_APPWRITE_PROJECT_ID || "";

      const url =
        `${endpointBase}/storage/buckets/${BUCKET_ID}/files/${response.$id}/preview` +
        `?project=${projectId}&width=256&height=256`;

      setState({ uploading: false, error: null });
      return url;
    } catch (err: any) {
      console.error("[useLogoUpload] Upload failed:", err);
      setState({ uploading: false, error: err.message || "Upload failed" });
      return null;
    }
  };

  return { uploadLogo, uploading: state.uploading, uploadError: state.error };
}
