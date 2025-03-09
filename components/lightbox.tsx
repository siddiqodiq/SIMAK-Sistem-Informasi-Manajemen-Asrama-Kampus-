"use client";

import React, { useState } from "react";
import ReactModal from "react-modal";
import { X, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, ZoomIn, ZoomOut } from "lucide-react";

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

export default function Lightbox({ isOpen, onClose, imageUrl }: LightboxProps) {
  const [scale, setScale] = useState(1); // Zoom level
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Posisi gambar

  // Zoom In
  const zoomIn = () => setScale((prev) => prev + 0.25);

  // Zoom Out
  const zoomOut = () => setScale((prev) => Math.max(1, prev - 0.25));

  // Reset Zoom & Posisi
  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Geser gambar dengan arrow buttons
  const moveImage = (direction: "left" | "right" | "up" | "down") => {
    const moveStep = 50; // Jarak per geseran
    setPosition((prev) => {
      switch (direction) {
        case "left":
          return { ...prev, x: prev.x + moveStep }; // Perbaikan: geser ke kanan
        case "right":
          return { ...prev, x: prev.x - moveStep }; // Perbaikan: geser ke kiri
        case "up":
          return { ...prev, y: prev.y + moveStep }; // Sesuai ekspektasi
        case "down":
          return { ...prev, y: prev.y - moveStep }; // Sesuai ekspektasi
        default:
          return prev;
      }
    });
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Gambar Kerusakan"
      className="fixed inset-0 flex items-center justify-center bg-black/90"
      overlayClassName="fixed inset-0"
    >
      <div className="relative flex flex-col items-center">
        {/* Gambar dengan Zoom & Navigasi */}
        <div className="relative">
          <img
            src={imageUrl}
            alt="Gambar Kerusakan"
            className="max-w-full max-h-[80vh] object-contain transition-transform"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            }}
            onClick={zoomIn} // Klik untuk zoom in
            onDoubleClick={resetZoom} // Double-click untuk reset zoom
          />
        </div>

        {/* Tombol Kontrol (Minimalis) */}
        <div className="absolute bottom-4 flex gap-3 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-md">
          {/* Tombol Zoom */}
          <button onClick={zoomIn} className="p-3 bg-white/50 rounded-md hover:bg-white/70 transition">
            <ZoomIn className="h-5 w-5" />
          </button>
          <button onClick={zoomOut} className="p-3 bg-white/50 rounded-md hover:bg-white/70 transition">
            <ZoomOut className="h-5 w-5" />
          </button>

          {/* Tombol Panah (Arrow) */}
          <button onClick={() => moveImage("up")} className="p-3 bg-white/50 rounded-md hover:bg-white/70 transition">
            <ArrowUp className="h-5 w-5" />
          </button>
          <button onClick={() => moveImage("left")} className="p-3 bg-white/50 rounded-md hover:bg-white/70 transition">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button onClick={() => moveImage("right")} className="p-3 bg-white/50 rounded-md hover:bg-white/70 transition">
            <ArrowRight className="h-5 w-5" />
          </button>
          <button onClick={() => moveImage("down")} className="p-3 bg-white/50 rounded-md hover:bg-white/70 transition">
            <ArrowDown className="h-5 w-5" />
          </button>

          {/* Tombol Close */}
          <button onClick={onClose} className="p-3 bg-red-500 rounded-md hover:bg-red-600 transition">
            <X className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
    </ReactModal>
  );
}
