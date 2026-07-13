import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { FileText, UploadCloud, ExternalLink } from "lucide-react";
import { uploadResume } from "../api/profile";
import { getErrorMessage } from "../api/axios";

interface ResumeUploadProps {
  currentResumeUrl?: string;
  onUploaded?: (url: string) => void;
}

export default function ResumeUpload({ currentResumeUrl, onUploaded }: ResumeUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setUploading(true);
    try {
      const res = await uploadResume(file);
      toast.success("Resume uploaded successfully");
      onUploaded?.(res?.resume_url ?? res?.url ?? "");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to upload resume"));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="label-field">Resume</label>
      <div className="flex flex-col gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <FileText size={18} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-700">
              {fileName ?? (currentResumeUrl ? "Resume uploaded" : "No resume uploaded yet")}
            </p>
            {currentResumeUrl && (
              <a
                href={currentResumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:underline"
              >
                View current resume <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="btn-secondary !px-3.5 !py-2 text-xs"
          >
            <UploadCloud size={15} />
            {uploading ? "Uploading..." : "Upload PDF/DOC"}
          </button>
        </div>
      </div>
    </div>
  );
}
