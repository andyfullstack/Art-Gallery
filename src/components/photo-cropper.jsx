import { useState, useRef, useEffect, useCallback } from 'react';
import { RotateCw, ZoomIn, ZoomOut } from 'lucide-react';

export function PhotoCropper({ photoPreview, onCrop, onClose }) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const drawCropped = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imgRef.current) return;

    const ctx = canvas.getContext('2d');
    const size = 200; // Размер круга в пиксселях
    canvas.width = size;
    canvas.height = size;

    // Очищаем канвас
    ctx.clearRect(0, 0, size, size);

    // Рисуем круговую маску
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.clip();

    // Сохраняем состояние контекста
    ctx.save();
    ctx.translate(size / 2, size / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-size / 2, -size / 2);

    // Рисуем изображение
    const img = imgRef.current;
    const imgWidth = img.width * zoom;
    const imgHeight = img.height * zoom;
    const x = (size - imgWidth) / 2 + position.x;
    const y = (size - imgHeight) / 2 + position.y;

    ctx.drawImage(img, x, y, imgWidth, imgHeight);
    ctx.restore();
  }, [zoom, rotation, position]);

  useEffect(() => {
    const img = new Image();
    img.src = photoPreview;
    img.onload = () => {
      imgRef.current = img;
      drawCropped();
    };
  }, [photoPreview, drawCropped]);

  useEffect(() => {
    drawCropped();
  }, [drawCropped]);

  const handleMouseDown = e => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = e => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCrop = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const croppedImage = canvas.toDataURL('image/png');
      onCrop(croppedImage);
    }
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h3 className="text-lg font-bold mb-4">Обрезать фото</h3>

        {/* Preview Canvas */}
        <div className="mb-4 flex justify-center">
          <div
            className="relative w-[200px] h-[200px] bg-muted rounded-full overflow-hidden border-2 border-border cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              src={photoPreview}
              alt="Preview"
              className="absolute w-full h-full object-cover"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg) translate(${position.x}px, ${position.y}px)`,
                cursor: isDragging ? 'grabbing' : 'grab',
              }}
            />
          </div>
        </div>

        {/* Rendering Canvas (hidden) */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Controls */}
        <div className="space-y-4 mb-4">
          {/* Zoom Slider */}
          <div>
            <label className="block text-sm font-semibold mb-2">Масштаб</label>
            <div className="flex items-center gap-2">
              <ZoomOut className="w-4 h-4 text-muted-foreground" />
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={e => setZoom(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
              <ZoomIn className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm w-8">{zoom.toFixed(1)}x</span>
            </div>
          </div>

          {/* Rotation Slider */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              <span className="flex items-center gap-2">
                <RotateCw className="w-4 h-4" />
                Поворот
              </span>
            </label>
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={rotation}
              onChange={e => setRotation(parseInt(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-muted-foreground mt-1">{rotation}°</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
          >
            Сброс
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handleCrop}
            className="flex-1 px-4 py-2 bg-primary dark:bg-accent text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Применить
          </button>
        </div>
      </div>
    </div>
  );
}
