import { QRCodeSVG } from "qrcode.react";
import { Download, ScanLine } from "lucide-react";
import { useRef } from "react";
import { member } from "@/mockdata/member";

export function QRCard() {
  const qrRef = useRef<HTMLDivElement>(null);

  const saveToGallery = async () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const serializedSvg = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([serializedSvg], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);
    const image = new Image();

    image.onload = () => {
      const padding = 48;
      const size = 180 + padding * 2;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;

      const context = canvas.getContext("2d");
      if (!context) {
        URL.revokeObjectURL(svgUrl);
        return;
      }

      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, size, size);
      context.drawImage(image, padding, padding, 180, 180);

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `${member.memberId}-gym-qr.png`;
      link.click();
      URL.revokeObjectURL(svgUrl);
    };

    image.src = svgUrl;
  };

  return (
    <div className="m3-card-elevated p-6 flex flex-col items-center text-center">
      <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant mb-4">
        <ScanLine className="size-4" />
        Gym Check-In QR
      </div>
      <div ref={qrRef} className="p-4 bg-white rounded-3xl border border-outline-variant/40 shadow-soft">
        <QRCodeSVG
          value={member.memberId}
          size={180}
          bgColor="#ffffff"
          fgColor="#131b2e"
          level="H"
          marginSize={1}
        />
      </div>
      <div className="mt-5">
        <div className="font-display text-lg font-bold text-on-surface">{member.memberId}</div>
        <div className="text-xs text-on-surface-variant mt-1">Scan at gym entrance</div>
      </div>
      <button
        type="button"
        onClick={saveToGallery}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-container py-3 text-sm font-semibold text-white transition hover:bg-primary-container/90"
      >
        <Download className="size-4" />
        Save to Gallery
      </button>
    </div>
  );
}
