// components/ui/ModalBase.tsx
import { ReactNode } from "react";

interface ModalBaseProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function ModalBase({
  open,
  onClose,
  title,
  children,
}: ModalBaseProps) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 text-white rounded-lg shadow-lg max-w-3xl w-full relative border border-gray-700">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h3 className="text-lg font-bold">{title || "Modal"}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="p-4 max-h-[75vh] overflow-y-auto">{children}</div>
          </div>
        </div>
      )}
    </>
  );
}
