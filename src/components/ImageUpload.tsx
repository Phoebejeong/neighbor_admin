import React, { useRef } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { useToast } from './Toast';

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
  max?: number;
  label?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export const ImageUpload: React.FC<Props> = ({ images, onChange, max = 5, label = '이미지 업로드' }) => {
  const ref = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = max - images.length;
    const toAdd: File[] = [];

    for (const file of files.slice(0, remaining)) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast(`${file.name}: 지원하지 않는 파일 형식입니다 (JPG, PNG, GIF, WebP만 가능)`, 'error');
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast(`${file.name}: 파일 크기가 5MB를 초과합니다`, 'error');
        continue;
      }
      toAdd.push(file);
    }

    if (toAdd.length > 0) {
      const newImages = toAdd.map(f => URL.createObjectURL(f));
      onChange([...images, ...newImages]);
    }
    if (ref.current) ref.current.value = '';
  };

  const remove = (idx: number) => {
    onChange(images.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-stone-500 mb-1.5">{label} (최대 {max}장)</label>
      <div className="flex flex-wrap gap-2">
        {images.map((src, i) => (
          <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-stone-200 group">
            <img src={src} alt="" className="w-full h-full object-cover" />
            <button
              onClick={() => remove(i)}
              className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        ))}
        {images.length < max && (
          <button
            onClick={() => ref.current?.click()}
            className="w-20 h-20 rounded-lg border-2 border-dashed border-stone-300 hover:border-[#A05050] flex flex-col items-center justify-center gap-1 transition text-stone-400 hover:text-[#7f2929]"
          >
            <ImagePlus className="w-5 h-5" />
            <span className="text-xs font-medium">추가</span>
          </button>
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" multiple hidden onChange={handleFiles} />
    </div>
  );
};
