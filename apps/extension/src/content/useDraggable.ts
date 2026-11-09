import { useCallback, useEffect, useRef } from 'react';
import {
  calculateDefaultPosition,
  calculateDockPosition,
  clampToViewport,
  DRAG_THRESHOLD_PX,
  recalculateDockedPosition,
} from './docking';
import { loadSavedPosition, saveCompanionPosition } from './storage';
import { useCompanionStore } from './store';

interface MutableDragState {
  pointerId: number | null;
  isPointerDown: boolean;
  isDragging: boolean;
  capturedElement: HTMLElement | null;
  startPointer: { x: number; y: number };
  startPos: { x: number; y: number };
  currentPos: { x: number; y: number };
}

/**
 * Custom React hook managing pointer-based dragging, edge docking snap,
 * viewport clamping, rAF throttling, lifecycle safety, and Chrome Storage persistence.
 */
export function useDraggable() {
  const {
    position,
    isDragging,
    isInitialized,
    setPosition,
    setCoordinates,
    setIsDragging,
    initializePosition,
  } = useCompanionStore();

  const isMountedRef = useRef(true);

  const dragStateRef = useRef<MutableDragState>({
    pointerId: null,
    isPointerDown: false,
    isDragging: false,
    capturedElement: null,
    startPointer: { x: 0, y: 0 },
    startPos: { x: 0, y: 0 },
    currentPos: { x: 0, y: 0 },
  });

  const rafRef = useRef<number | null>(null);

  // 1. Initial Position Restoration from chrome.storage.local
  useEffect(() => {
    async function restorePosition() {
      const width = typeof window !== 'undefined' ? window.innerWidth : 1280;
      const height = typeof window !== 'undefined' ? window.innerHeight : 800;

      const saved = await loadSavedPosition(width, height);
      if (!isMountedRef.current) return;

      if (saved) {
        initializePosition(saved);
      } else {
        initializePosition(calculateDefaultPosition(width, height));
      }
    }

    restorePosition();
  }, [initializePosition]);

  // 2. Viewport Resize Handler (preserves dockSide and clamps vertical coordinate)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let resizeTimer: number | null = null;

    const handleResize = () => {
      if (resizeTimer !== null) {
        window.clearTimeout(resizeTimer);
      }

      resizeTimer = window.setTimeout(() => {
        if (!isMountedRef.current) return;

        const width = window.innerWidth;
        const height = window.innerHeight;
        const current = useCompanionStore.getState().position;

        // Maintain edge docking on resize while strictly preserving existing dockSide
        const docked = recalculateDockedPosition(current, width, height);
        setPosition(docked);
      }, 50);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimer !== null) {
        window.clearTimeout(resizeTimer);
      }
    };
  }, [setPosition]);

  // 3. Centralized Drag Finalization (safe, idempotent lifecycle handler)
  const finalizeDrag = useCallback(
    (targetElement?: HTMLElement | null) => {
      // Guard: do not perform state updates if component is unmounted
      if (!isMountedRef.current) {
        return;
      }

      const state = dragStateRef.current;

      // Idempotency guard: prevent duplicate finalization of the same pointer gesture
      if (!state.isPointerDown && !state.isDragging && state.pointerId === null) {
        return;
      }

      // Step 1: Capture required final drag data into local variables
      const {
        pointerId,
        isDragging: wasDragging,
        currentPos,
        capturedElement,
      } = state;
      const el = targetElement || capturedElement;

      // Step 2: Immediately mark and reset mutable drag state before releasing pointer capture.
      // This ensures subsequent lostpointercapture, pointerup, or blur events immediately
      // observe pointerId === null / isPointerDown === false and exit via the idempotency guard.
      dragStateRef.current = {
        pointerId: null,
        isPointerDown: false,
        isDragging: false,
        capturedElement: null,
        startPointer: { x: 0, y: 0 },
        startPos: { x: 0, y: 0 },
        currentPos: { x: 0, y: 0 },
      };

      // Step 3: Cancel any pending rAF frame
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      // Step 4: Safely release pointer capture using captured local references
      if (el && pointerId !== null) {
        try {
          if (el.hasPointerCapture(pointerId)) {
            el.releasePointerCapture(pointerId);
          }
        } catch {
          // Ignored if capture already lost or element unmounted
        }
      }

      // Step 5: If an actual drag was active, calculate final dock position, update store, and persist
      if (wasDragging) {
        const finalCoords = currentPos;
        const width = typeof window !== 'undefined' ? window.innerWidth : 1280;
        const height = typeof window !== 'undefined' ? window.innerHeight : 800;

        const docked = calculateDockPosition(
          finalCoords.x,
          finalCoords.y,
          width,
          height
        );

        setPosition(docked);
        setIsDragging(false);

        // Persist to storage exactly once upon completed drag gesture
        saveCompanionPosition(docked, height);
      } else {
        // Step 6: If it was only a click/tap, reset drag state and do not persist
        setIsDragging(false);
      }
    },
    [setPosition, setIsDragging]
  );

  // 4. Window Blur Handler (safely finalizes active drag if window loses focus)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleWindowBlur = () => {
      if (dragStateRef.current.isPointerDown || dragStateRef.current.isDragging) {
        finalizeDrag();
      }
    };

    window.addEventListener('blur', handleWindowBlur);

    return () => {
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [finalizeDrag]);

  // 5. Cleanup on component unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;

      // Cancel pending rAF frame
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      // Release pointer capture safely if held during teardown
      const state = dragStateRef.current;
      if (state.capturedElement && state.pointerId !== null) {
        try {
          if (state.capturedElement.hasPointerCapture(state.pointerId)) {
            state.capturedElement.releasePointerCapture(state.pointerId);
          }
        } catch {
          // Ignored if capture already lost or element unmounted
        }
      }

      // Reset mutable state without triggering React state updates or duplicate storage writes
      dragStateRef.current = {
        pointerId: null,
        isPointerDown: false,
        isDragging: false,
        capturedElement: null,
        startPointer: { x: 0, y: 0 },
        startPos: { x: 0, y: 0 },
        currentPos: { x: 0, y: 0 },
      };
    };
  }, []);

  // 6. Pointer Down: Initiates pointer tracking
  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      // Respond only to primary pointer and left-click / touch / pen
      if (!e.isPrimary) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;

      dragStateRef.current = {
        pointerId: e.pointerId,
        isPointerDown: true,
        isDragging: false,
        capturedElement: null,
        startPointer: { x: e.clientX, y: e.clientY },
        startPos: { x: position.x, y: position.y },
        currentPos: { x: position.x, y: position.y },
      };
    },
    [position.x, position.y]
  );

  // 7. Pointer Move: Distinguishes click from drag, clamps within viewport, schedules rAF
  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const state = dragStateRef.current;
      if (!state.isPointerDown || state.pointerId !== e.pointerId) return;

      const dx = e.clientX - state.startPointer.x;
      const dy = e.clientY - state.startPointer.y;

      // Threshold check to prevent accidental drag during simple clicks
      if (!state.isDragging) {
        if (Math.hypot(dx, dy) >= DRAG_THRESHOLD_PX) {
          state.isDragging = true;
          setIsDragging(true);

          try {
            e.currentTarget.setPointerCapture(e.pointerId);
            state.capturedElement = e.currentTarget;
          } catch (err) {
            console.debug('[WebMate] Pointer capture could not be set:', err);
          }
        } else {
          return;
        }
      }

      // Calculate raw dragged coordinate and clamp to visible viewport
      const rawX = state.startPos.x + dx;
      const rawY = state.startPos.y + dy;
      const clamped = clampToViewport(
        rawX,
        rawY,
        window.innerWidth,
        window.innerHeight
      );

      state.currentPos = clamped;

      // Throttle coordinate updates to display refresh rate
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = null;
          setCoordinates(state.currentPos);
        });
      }
    },
    [setCoordinates, setIsDragging]
  );

  // 8. Pointer Up: Completed gesture (validates pointer ID before finalization)
  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (
        dragStateRef.current.pointerId === null ||
        dragStateRef.current.pointerId !== e.pointerId
      ) {
        return;
      }
      finalizeDrag(e.currentTarget);
    },
    [finalizeDrag]
  );

  // 9. Pointer Cancel: Abrupt cancellation (validates pointer ID before finalization)
  const onPointerCancel = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (
        dragStateRef.current.pointerId === null ||
        dragStateRef.current.pointerId !== e.pointerId
      ) {
        return;
      }
      finalizeDrag(e.currentTarget);
    },
    [finalizeDrag]
  );

  // 10. Lost Pointer Capture: Handles loss of capture without interfering with finalized gestures
  const onLostPointerCapture = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (
        dragStateRef.current.pointerId === null ||
        dragStateRef.current.pointerId !== e.pointerId
      ) {
        return;
      }
      finalizeDrag(e.currentTarget);
    },
    [finalizeDrag]
  );

  return {
    position,
    isDragging,
    isInitialized,
    dragProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      onLostPointerCapture,
    },
  };
}
