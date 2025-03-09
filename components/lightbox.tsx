// components/lightbox.tsx
"use client";

import ReactModal from "react-modal";
import { X } from "lucide-react";

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

export default function Lightbox({ isOpen, onClose, imageUrl }: LightboxProps) {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Gambar Kerusakan"
      className="fixed inset-0 flex items-center justify-center bg-black/90"
      overlayClassName="fixed inset-0"
    >
      <div className="relative max-w-[90vw] max-h-[90vh]">
        <img
          src={imageUrl}
          alt="Gambar Kerusakan"
          className="max-w-full max-h-[80vh] object-contain"
        />
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 p-2 text-white hover:text-gray-300"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
    </ReactModal>
  );
}