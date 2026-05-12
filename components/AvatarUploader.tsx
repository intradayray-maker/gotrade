"use client";

import { useState } from "react";

export default function AvatarUploader({ currentAvatar }: { currentAvatar: string }) {
  const [preview, setPreview] = useState(currentAvatar);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/profile/avatar", {
      method: "POST",
      body: formData,
    });

    // ⭐ Prevent JSON parse crash when API route fails
    if (!res.ok) {
      console.error("Avatar upload failed:", await res.text());
      setUploading(false);
      return;
    }

    const json = await res.json();
    setUploading(false);

    if (json.avatarUrl) {
      // Update preview to the real uploaded URL
      setPreview(json.avatarUrl);

      // ⭐ Force server components (Header, Profile page) to reload user metadata
      window.location.reload();
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <img
        src={preview}
        onError={(e) => {
          e.currentTarget.src = "/default-avatar.png";
        }}
        className="w-24 h-24 rounded-full border border-white/10 object-cover"
      />

      <label className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg cursor-pointer text-sm">
        {uploading ? "Uploading..." : "Change Avatar"}
        <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </label>
    </div>
  );
}
