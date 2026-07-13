import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Camera, User } from "lucide-react";
import { uploadProfilePhoto } from "../api/profile";
import { getErrorMessage } from "../api/axios";

interface ProfilePhotoUploadProps {
  currentPhotoUrl?: string;
  onUploaded?: (url: string) => void;
}

export default function ProfilePhotoUpload({ currentPhotoUrl, onUploaded }: ProfilePhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const res = await uploadProfilePhoto(file);
      toast.success("Profile photo updated");
      onUploaded?.(res?.photo_url ?? res?.url ?? "");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to upload photo"));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const imageSrc = preview ?? currentPhotoUrl;

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-slate-100 ring-4 ring-white shadow">
        {imageSrc ? (
          <img src={imageSrc} alt="Profile" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400">
            <User size={30} />
          </div>
        )}
      </div>
      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="btn-secondary !px-3.5 !py-2 text-xs"
        >
          <Camera size={15} />
          {uploading ? "Uploading..." : "Change photo"}
        </button>
        <p className="mt-1.5 text-xs text-slate-400">JPG or PNG, up to 5MB</p>
      </div>
    </div>
  );
}
