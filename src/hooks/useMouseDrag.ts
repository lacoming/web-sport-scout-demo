import { useCallback, useRef, useState } from 'react';

interface DragState {
  isDragging: boolean;
  dragId: number | null;
  startX: number;
  startY: number;
}

/**
 * Hook for SVG drag-and-drop.
 * Converts mouse positions to SVG-local coordinates via getScreenCTM().
 */
export function useMouseDrag(
  svgRef: React.RefObject<SVGSVGElement | null>,
  onDrag: (id: number, x: number, y: number) => void,
) {
  const [dragId, setDragId] = useState<number | null>(null);
  const stateRef = useRef<DragState>({ isDragging: false, dragId: null, startX: 0, startY: 0 });

  const toSvgCoords = useCallback(
    (clientX: number, clientY: number): { x: number; y: number } | null => {
      const svg = svgRef.current;
      if (!svg) return null;
      const ctm = svg.getScreenCTM();
      if (!ctm) return null;
      return {
        x: (clientX - ctm.e) / ctm.a,
        y: (clientY - ctm.f) / ctm.d,
      };
    },
    [svgRef],
  );

  const handleMouseDown = useCallback(
    (id: number, e: React.MouseEvent) => {
      e.preventDefault();
      stateRef.current = { isDragging: true, dragId: id, startX: e.clientX, startY: e.clientY };
      setDragId(id);
    },
    [],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!stateRef.current.isDragging || stateRef.current.dragId === null) return;
      const coords = toSvgCoords(e.clientX, e.clientY);
      if (!coords) return;
      onDrag(stateRef.current.dragId, coords.x, coords.y);
    },
    [toSvgCoords, onDrag],
  );

  const handleMouseUp = useCallback(() => {
    stateRef.current = { isDragging: false, dragId: null, startX: 0, startY: 0 };
    setDragId(null);
  }, []);

  return { dragId, handleMouseDown, handleMouseMove, handleMouseUp };
}
