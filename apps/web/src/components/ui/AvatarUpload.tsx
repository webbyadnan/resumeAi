'use client';

import { useState, useRef } from 'react';
import { Upload, User } from 'lucide-react';

interface AvatarUploadProps {
    currentUrl?: string;
    onUpload: (file: File, url: string) => void;
}

/** Compress an image File to a max dimension, returning a base64 data URL */
function compressImage(file: File, maxSize = 200): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(objectUrl);

            const canvas = document.createElement('canvas');
            let { width, height } = img;

            // Scale down proportionally
            if (width > maxSize || height > maxSize) {
                if (width > height) {
                    height = Math.round((height / width) * maxSize);
                    width = maxSize;
                } else {
                    width = Math.round((width / height) * maxSize);
                    height = maxSize;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0, width, height);

            // JPEG at 80% quality keeps file very small
            resolve(canvas.toDataURL('image/jpeg', 0.8));
        };

        img.onerror = reject;
        img.src = objectUrl;
    });
}

export default function AvatarUpload({ currentUrl, onUpload }: AvatarUploadProps) {
    const [preview, setPreview] = useState<string | null>(currentUrl || null);
    const ref = useRef<HTMLInputElement>(null);

    const handleFile = async (file: File) => {
        try {
            const compressed = await compressImage(file);
            setPreview(compressed);
            onUpload(file, compressed);
        } catch {
            // Fallback to direct FileReader if canvas fails
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setPreview(base64);
                onUpload(file, base64);
            };
            reader.readAsDataURL(file);
        }
    };

    // Sync preview when parent updates currentUrl from DB load
    if (currentUrl && currentUrl !== preview) {
        setPreview(currentUrl);
    }

    return (
        <div className="flex items-center gap-4">
            <div
                className="w-16 h-16 rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center cursor-pointer hover:border-primary/60 transition-colors overflow-hidden bg-blue-50 flex-shrink-0"
                onClick={() => ref.current?.click()}
            >
                {preview ? (
                    <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                    <User className="w-6 h-6 text-primary/40" />
                )}
            </div>
            <div>
                <button
                    type="button"
                    onClick={() => ref.current?.click()}
                    className="flex items-center gap-2 text-sm text-primary font-medium hover:text-primary-dark"
                >
                    <Upload className="w-4 h-4" />
                    Upload photo
                </button>
                <p className="text-xs text-slate-400 mt-0.5">JPG, PNG up to 5MB</p>
            </div>
            <input
                ref={ref}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                }}
            />
        </div>
    );
}
