import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Camera, Building2 } from "lucide-react";
import { uploadCompanyLogo } from "../api/company";
import { getErrorMessage } from "../api/axios";

interface CompanyLogoUploadProps {
  companyId: string | number;
  currentLogoUrl?: string;
  onUploaded?: (url: string) => void;
}

export default function CompanyLogoUpload({
  companyId,
  currentLogoUrl,
  onUploaded,
}: CompanyLogoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const res = await uploadCompanyLogo(companyId, file);
      toast.success("Company logo updated");
      onUploaded?.(res?.logo_url ?? res?.url ?? "");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to upload logo"));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const imageSrc = preview ?? currentLogoUrl;

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 ring-4 ring-white shadow">
        {imageSrc ? (
          <img src={imageSrc} alt="Company logo" className="h-full w-full object-cover" />
        ) : (
          <Building2 size={30} className="text-slate-400" />
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
          {uploading ? "Uploading..." : "Change logo"}
        </button>
        <p className="mt-1.5 text-xs text-slate-400">Square image recommended</p>
      </div>
    </div>
  );
}
