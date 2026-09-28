import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
} from "@dnd-kit/core";
import Timmer from "./Timmer";
import WaterReminder from "./WaterReminder";
import Todo from "./Todo";
import Clock from "./Clock";
import ImportantTabs from "./ImportantTabs";
import StreakGrid from "./StreakGrid";
import SongPlayer from "./SongPlayer";
import TimeBoxing from "./TimeBoxing";
import { storageGet, storageSet } from "../utils/storage.js";

/* ─── Grid Configuration & Responsive Helpers ─── */
/* ─── Grid Configuration & Responsive Helpers ─── */
const MIN_GRID_ROWS = 6;

const WIDGET_CONFIGS_LAPTOP = {
  timer: {
    cols: 4,
    defaultCols: 4,
    minCols: 2,
    maxCols: 8,
    defaultRows: 2,
    minRows: 2,
    maxRows: 6,
    resizable: true,
    draggable: true,
  },
  waterReminder: {
    cols: 4,
    defaultCols: 4,
    minCols: 2,
    maxCols: 8,
    defaultRows: 2,
    minRows: 2,
    maxRows: 6,
    resizable: true,
    draggable: true,
  },
  todo: {
    cols: 3,
    defaultCols: 3,
    minCols: 2,
    maxCols: 8,
    defaultRows: 2,
    minRows: 2,
    maxRows: 8,
    resizable: true,
    draggable: true,
  },
  importantTabs: {
    cols: 3,
    defaultCols: 3,
    minCols: 2,
    maxCols: 8,
    defaultRows: 2,
    minRows: 2,
    maxRows: 8,
    resizable: true,
    draggable: true,
  },
  streakGrid: {
    cols: 11,
    defaultCols: 11,
    minCols: 4,
    maxCols: 16,
    defaultRows: 2,
    minRows: 2,
    maxRows: 6,
    resizable: true,
    draggable: true,
  },
  songPlayer: {
    cols: 5,
    defaultCols: 5,
    minCols: 3,
    maxCols: 10,
    defaultRows: 2,
    minRows: 2,
    maxRows: 6,
    resizable: true,
    draggable: true,
  },
  timeBoxing: {
    cols: 4,
    defaultCols: 4,
    minCols: 2,
    maxCols: 10,
    defaultRows: 4,
    minRows: 2,
    maxRows: 8,
    resizable: true,
    draggable: true,
  },
};

const WIDGET_CONFIGS_DESKTOP = {
  timer: {
    cols: 4,
    defaultCols: 4,
    minCols: 2,
    maxCols: 10,
    defaultRows: 2,
    minRows: 2,
    maxRows: 6,
    resizable: true,
    draggable: true,
  },
  waterReminder: {
    cols: 4,
    defaultCols: 4,
    minCols: 2,
    maxCols: 10,
    defaultRows: 2,
    minRows: 2,
    maxRows: 6,
    resizable: true,
    draggable: true,
  },
  todo: {
    cols: 4,
    defaultCols: 4,
    minCols: 2,
    maxCols: 10,
    defaultRows: 2,
    minRows: 2,
    maxRows: 8,
    resizable: true,
    draggable: true,
  },
  importantTabs: {
    cols: 3,
    defaultCols: 3,
    minCols: 2,
    maxCols: 10,
    defaultRows: 2,
    minRows: 2,
    maxRows: 8,
    resizable: true,
    draggable: true,
  },
  streakGrid: {
    cols: 11,
    defaultCols: 11,
    minCols: 4,
    maxCols: 20,
    defaultRows: 2,
    minRows: 2,
    maxRows: 6,
    resizable: true,
    draggable: true,
  },
  songPlayer: {
    cols: 4,
    defaultCols: 4,
    minCols: 3,
    maxCols: 10,
    defaultRows: 2,
    minRows: 2,
    maxRows: 6,
    resizable: true,
    draggable: true,
  },
  timeBoxing: {
    cols: 5,
    defaultCols: 5,
    minCols: 2,
    maxCols: 12,
    defaultRows: 6,
    minRows: 2,
    maxRows: 10,
    resizable: true,
    draggable: true,
  },
};

const getWidgetConfigs = (tier) =>
  tier === "desktop" ? WIDGET_CONFIGS_DESKTOP : WIDGET_CONFIGS_LAPTOP;

/* ─── Device Tier Breakpoints & Default Positions ─── */
const getDeviceTier = (width) => {
  if (typeof window === "undefined") return "laptop";
  const w = width ?? window.innerWidth;
  return w >= 1600 ? "desktop" : "laptop";
};

const DEFAULT_POSITIONS_LAPTOP = {
  timer: { col: 1, row: 1, rows: 2 },
  waterReminder: { col: 1, row: 3, rows: 2 },
  todo: { col: 5, row: 1, rows: 2 },
  importantTabs: { col: 8, row: 1, rows: 2 },
  songPlayer: { col: 5, row: 3, rows: 2 },
  timeBoxing: { col: 12, row: 1, rows: 4 },
  streakGrid: { col: 5, row: 5, rows: 2 },
};

const DEFAULT_POSITIONS_DESKTOP = {
  timer: { col: 1, row: 1, rows: 2 },
  waterReminder: { col: 1, row: 3, rows: 2 },
  todo: { col: 5, row: 1, rows: 2 },
  importantTabs: { col: 9, row: 1, rows: 2 },
  songPlayer: { col: 5, row: 3, rows: 2 },
  timeBoxing: { col: 17, row: 1, rows: 4 },
  streakGrid: { col: 11, row: 5, rows: 3 },
};

const getDefaultPositions = (tier) =>
  tier === "desktop" ? DEFAULT_POSITIONS_DESKTOP : DEFAULT_POSITIONS_LAPTOP;

const getStorageKeyForTier = (tier) => `settings_widget_positions_v8_${tier}`;

/* Calculate columns & rows dynamically based on window size */
const getDynamicGridSize = (tier = getDeviceTier()) => {
  if (typeof window === "undefined") {
    const minCols = tier === "desktop" ? 16 : 15;
    return { cols: minCols, rows: MIN_GRID_ROWS };
  }
  const width = window.innerWidth;
  const height = window.innerHeight;
  const minCols = tier === "desktop" ? 16 : 15;
  const cols = Math.max(minCols, Math.floor((width - 32) / 80));
  return {
    cols,
    rows: Math.max(MIN_GRID_ROWS, Math.floor((height - 96) / 100)),
  };
};

const clampPositionsToGrid = (
  posMap,
  gridCols,
  gridRows,
  widgetConfigs = WIDGET_CONFIGS_LAPTOP,
) => {
  const result = { ...posMap };
  for (const [id, pos] of Object.entries(result)) {
    const cfg = widgetConfigs[id];
    if (!cfg || typeof pos?.col !== "number" || typeof pos?.row !== "number")
      continue;
    const itemCols = cfg.resizable
      ? Math.max(
          cfg.minCols || 1,
          Math.min(cfg.maxCols || gridCols, pos.cols || cfg.defaultCols || cfg.cols),
        )
      : cfg.cols;
    const itemRows = cfg.resizable
      ? Math.max(
          cfg.minRows || 1,
          Math.min(cfg.maxRows || gridRows, pos.rows || cfg.defaultRows),
        )
      : cfg.defaultRows;

    const clampedCol = Math.max(1, Math.min(gridCols - itemCols + 1, pos.col));
    const clampedRow = Math.max(1, Math.min(gridRows - itemRows + 1, pos.row));

    result[id] = {
      ...pos,
      col: clampedCol,
      row: clampedRow,
      cols: itemCols,
      rows: itemRows,
      ...(pos.widthPx ? { widthPx: pos.widthPx } : {}),
      ...(pos.heightPx ? { heightPx: pos.heightPx } : {}),
    };
  }
  return result;
};

/* ─── Storage Keys ─── */
const STORAGE_KEY = "settings_widget_positions_v7";
const STORAGE_KEY_V5 = "settings_widget_positions_v5";

/* ─── Collision Helpers ─── */

/** True when two axis-aligned grid rectangles share at least one cell */
const rectsOverlap = (aCol, aRow, aCols, aRows, bCol, bRow, bCols, bRows) =>
  !(
    aCol + aCols <= bCol ||
    bCol + bCols <= aCol ||
    aRow + aRows <= bRow ||
    bRow + bRows <= aRow
  );

/** Can `widgetId` be placed at (col, row) with (cols, rows) without going OOB or colliding? */
const canPlace = (
  widgetId,
  col,
  row,
  positions,
  activeWidgets,
  gridCols,
  gridRows,
  customRows = null,
  customCols = null,
  widgetConfigs = WIDGET_CONFIGS_LAPTOP,
) => {
  const cfg = widgetConfigs[widgetId];
  if (!cfg) return false;
  const currentPos = positions[widgetId];
  const itemCols = customCols || currentPos?.cols || cfg.cols;
  const itemRows = customRows || currentPos?.rows || cfg.defaultRows || 1;

  if (
    col < 1 ||
    row < 1 ||
    col + itemCols - 1 > gridCols ||
    row + itemRows - 1 > gridRows
  )
    return false;

  for (const [id, pos] of Object.entries(positions)) {
    if (id === widgetId || !activeWidgets[id] || !pos || typeof pos?.col !== "number" || typeof pos?.row !== "number") continue;
    const oc = widgetConfigs[id];
    const oCols = pos.cols || oc?.cols || 1;
    const oRows = pos.rows || oc?.defaultRows || 1;
    if (
      oc &&
      rectsOverlap(
        col,
        row,
        itemCols,
        itemRows,
        pos.col,
        pos.row,
        oCols,
        oRows,
      )
    )
      return false;
  }
  return true;
};

/** Convert initial bounding rect + delta → 1-indexed grid cell */
const cellFromTranslatedRect = (
  initialRect,
  delta,
  widgetId,
  gridEl,
  gridCols,
  gridRows,
  itemRows = null,
  itemCols = null,
  widgetConfigs = WIDGET_CONFIGS_LAPTOP,
) => {
  if (!gridEl || !initialRect || !delta) return null;
  const cfg = widgetConfigs[widgetId];
  if (!cfg) return null;
  const gridRect = gridEl.getBoundingClientRect();
  if (gridRect.width <= 0 || gridRect.height <= 0) return null;

  const currentLeft = initialRect.left + delta.x;
  const currentTop = initialRect.top + delta.y;

  const relLeft = currentLeft - gridRect.left;
  const relTop = currentTop - gridRect.top;
  const cellWidth = gridRect.width / gridCols;
  const cellHeight = gridRect.height / gridRows;

  const activeItemCols = itemCols || cfg.cols;
  const activeItemRows = itemRows || cfg.defaultRows || 2;

  const targetCol = Math.min(
    gridCols - activeItemCols + 1,
    Math.max(1, Math.round(relLeft / cellWidth) + 1),
  );
  const targetRow = Math.min(
    gridRows - activeItemRows + 1,
    Math.max(1, Math.round(relTop / cellHeight) + 1),
  );

  return { col: targetCol, row: targetRow };
};

/* ─── Draggable Widget Wrapper Component ─── */
const DraggableWidget = ({ id, config, pos, onStartResize, renderWidget }) => {
  const currentCols = config.resizable
    ? Math.max(
        config.minCols || 1,
        Math.min(config.maxCols || 24, pos.cols || config.defaultCols || config.cols),
      )
    : config.cols;
  const currentRows = config.resizable
    ? Math.max(
        config.minRows || 1,
        Math.min(config.maxRows || 24, pos.rows || config.defaultRows),
      )
    : config.defaultRows;
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      disabled: !config.draggable,
    });

  const hasCustomPx = pos.widthPx && pos.heightPx;

  const style = {
    gridColumn: `${pos.col} / span ${currentCols}`,
    gridRow: `${pos.row} / span ${currentRows}`,
    ...(hasCustomPx
      ? {
          width: `${pos.widthPx}px`,
          height: `${pos.heightPx}px`,
        }
      : {}),
    ...(transform
      ? {
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
          zIndex: 100,
        }
      : {}),
  };

  const dragHandleProps = useMemo(
    () => ({ ...attributes, ...listeners }),
    [attributes, listeners],
  );

  return (
    <div
      ref={setNodeRef}
      className={`grid-widget ${isDragging ? "grid-widget--dragging" : ""}`}
      style={style}
    >
      {renderWidget(id, dragHandleProps)}

      {config.resizable && (
        <>
          {/* Edge: Top */}
          <div data-resize-handle onPointerDown={(e) => onStartResize(id, "top", e)}
            className="absolute top-0 left-3 right-3 h-2 cursor-ns-resize z-30 opacity-0" />

          {/* Edge: Bottom */}
          <div data-resize-handle onPointerDown={(e) => onStartResize(id, "bottom", e)}
            className="absolute bottom-0 left-3 right-3 h-2 cursor-ns-resize z-30 opacity-0" />

          {/* Edge: Left */}
          <div data-resize-handle onPointerDown={(e) => onStartResize(id, "left", e)}
            className="absolute left-0 top-3 bottom-3 w-2 cursor-ew-resize z-30 opacity-0" />

          {/* Edge: Right */}
          <div data-resize-handle onPointerDown={(e) => onStartResize(id, "right", e)}
            className="absolute right-0 top-3 bottom-3 w-2 cursor-ew-resize z-30 opacity-0" />

          {/* Corner: Top-Left */}
          <div data-resize-handle onPointerDown={(e) => onStartResize(id, "top-left", e)}
            className="absolute top-0 left-0 w-4 h-4 cursor-nwse-resize z-40 opacity-0" />

          {/* Corner: Top-Right */}
          <div data-resize-handle onPointerDown={(e) => onStartResize(id, "top-right", e)}
            className="absolute top-0 right-0 w-4 h-4 cursor-nesw-resize z-40 opacity-0" />

          {/* Corner: Bottom-Left */}
          <div data-resize-handle onPointerDown={(e) => onStartResize(id, "bottom-left", e)}
            className="absolute bottom-0 left-0 w-4 h-4 cursor-nesw-resize z-40 opacity-0" />

          {/* Corner: Bottom-Right */}
          <div data-resize-handle onPointerDown={(e) => onStartResize(id, "bottom-right", e)}
            className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-40 opacity-0" />
        </>
      )}
    </div>
  );
};

/* ─── DashboardGrid Component ─── */

const DashboardGrid = ({
  showTimer = true,
  showTodo = true,
  showStreakGrid = true,
  showSongPlayer = true,
  showWaterReminder = true,
  showImportantTabs = true,
  showTimeBoxing = true,
  importantTabsConfig,
  timeBoxingGroups,
  onTimeBoxingGroupsChange,
  songPlaylistUrl,
  songAutoPlay,
  songCustomVideo,
  lofiStations,
  waterGoalMl,
  resetTrigger,
}) => {
  const gridRef = useRef(null);
  const [deviceTier, setDeviceTier] = useState(() => getDeviceTier());
  const widgetConfigs = useMemo(
    () => getWidgetConfigs(deviceTier),
    [deviceTier],
  );

  const [positions, setPositions] = useState(() =>
    clampPositionsToGrid(
      getDefaultPositions(getDeviceTier()),
      getDynamicGridSize(getDeviceTier()).cols,
      getDynamicGridSize(getDeviceTier()).rows,
      getWidgetConfigs(getDeviceTier()),
    ),
  );
  const [ghostInfo, setGhostInfo] = useState(null);
  const [{ cols: gridCols, rows: gridRows }, setGridSize] = useState(() =>
    getDynamicGridSize(getDeviceTier()),
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
  );

  /* Window resize listener: updates grid size & device tier (Laptop vs Desktop) */
  useEffect(() => {
    const handleResize = () => {
      const newTier = getDeviceTier();
      const newGrid = getDynamicGridSize(newTier);
      setGridSize(newGrid);
      setDeviceTier((prevTier) => (prevTier !== newTier ? newTier : prevTier));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const hydratedRef = useRef(false);
  const positionsRef = useRef(positions);
  positionsRef.current = positions;

  const activeWidgets = useMemo(() => {
    const w = {};
    if (showTimer) w.timer = true;
    if (showTodo) w.todo = true;
    if (showStreakGrid) w.streakGrid = true;
    if (showSongPlayer) w.songPlayer = true;
    if (showWaterReminder) w.waterReminder = true;
    if (showImportantTabs) w.importantTabs = true;
    if (showTimeBoxing) w.timeBoxing = true;
    return w;
  }, [showTimer, showTodo, showStreakGrid, showSongPlayer, showWaterReminder, showImportantTabs, showTimeBoxing]);

  const activeRef = useRef(activeWidgets);
  activeRef.current = activeWidgets;

  /* ── Hydrate from storage per Device Tier (Laptop vs Desktop) ── */
  useEffect(() => {
    let cancelled = false;
    hydratedRef.current = false;
    (async () => {
      try {
        const tierKey = getStorageKeyForTier(deviceTier);
        let stored = await storageGet(tierKey);
        let isV5 = false;

        if (!stored || typeof stored !== "object") {
          const universalV6 = await storageGet(STORAGE_KEY);
          if (universalV6 && typeof universalV6 === "object") {
            stored = universalV6;
          } else {
            const v5stored = await storageGet(STORAGE_KEY_V5);
            if (v5stored && typeof v5stored === "object") {
              stored = v5stored;
              isV5 = true;
            }
          }
        }

        if (cancelled) return;
        const defaults = getDefaultPositions(deviceTier);
        const currentConfigs = getWidgetConfigs(deviceTier);

        if (stored && typeof stored === "object") {
          setPositions(() => {
            const merged = { ...defaults };
            for (const [id, pos] of Object.entries(stored)) {
              if (
                currentConfigs[id] &&
                typeof pos?.col === "number" &&
                typeof pos?.row === "number"
              ) {
                if (isV5) {
                  merged[id] = {
                    ...merged[id],
                    col: (pos.col - 1) * 2 + 1,
                    row: (pos.row - 1) * 2 + 1,
                    rows: (typeof pos?.rows === "number" ? pos.rows : 1) * 2,
                  };
                } else {
                  const cfg = currentConfigs[id];
                  const validCols = cfg.resizable
                    ? Math.max(
                        cfg.minCols || 1,
                        Math.min(
                          cfg.maxCols || gridCols,
                          typeof pos?.cols === "number"
                            ? pos.cols
                            : cfg.defaultCols || cfg.cols,
                        ),
                      )
                    : cfg.cols;

                  const validRows = cfg.resizable
                    ? Math.max(
                        cfg.minRows || 1,
                        Math.min(
                          cfg.maxRows || gridRows,
                          typeof pos?.rows === "number"
                            ? pos.rows
                            : cfg.defaultRows,
                        ),
                      )
                    : cfg.defaultRows;

                  merged[id] = {
                    ...merged[id],
                    col: pos.col,
                    row: pos.row,
                    cols: validCols,
                    rows: validRows,
                    ...(typeof pos?.widthPx === "number" ? { widthPx: pos.widthPx } : {}),
                    ...(typeof pos?.heightPx === "number" ? { heightPx: pos.heightPx } : {}),
                  };
                }
              }
            }
            return clampPositionsToGrid(
              merged,
              gridCols,
              gridRows,
              currentConfigs,
            );
          });
        } else {
          setPositions(
            clampPositionsToGrid(defaults, gridCols, gridRows, currentConfigs),
          );
        }
      } catch (err) {
        console.error("DashboardGrid hydration error:", err);
      } finally {
        if (!cancelled) hydratedRef.current = true;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [deviceTier, gridCols, gridRows]);

  /* ── Persist on change per Device Tier ── */
  useEffect(() => {
    if (!hydratedRef.current) return;
    const tierKey = getStorageKeyForTier(deviceTier);
    storageSet(tierKey, positions);
  }, [positions, deviceTier]);

  /* ── Listen for Reset Layout Trigger ── */
  useEffect(() => {
    if (!resetTrigger) return;
    const defaults = getDefaultPositions(deviceTier);
    const currentConfigs = getWidgetConfigs(deviceTier);
    const clamped = clampPositionsToGrid(defaults, gridCols, gridRows, currentConfigs);
    setPositions(clamped);
    const tierKey = getStorageKeyForTier(deviceTier);
    storageSet(tierKey, clamped);
  }, [resetTrigger, deviceTier, gridCols, gridRows]);

  /* ── Freeform 2D Resizing Logic (8 directions + textarea-like freeform drag) ── */
  const handleStartResize = useCallback(
    (widgetId, direction, e) => {
      e.preventDefault();
      e.stopPropagation();

      const widgetEl = e.currentTarget.closest(".grid-widget");
      if (!widgetEl || !gridRef.current) return;
      const widgetRect = widgetEl.getBoundingClientRect();
      const gridRect = gridRef.current.getBoundingClientRect();
      const cellWidth = gridRect.width / gridCols;
      const cellHeight = gridRect.height / gridRows;

      // Capture starting values at pointer-down time
      const startPos = positionsRef.current[widgetId];
      const cfg = widgetConfigs[widgetId];
      if (!startPos || !cfg) return;

      const startCol = startPos.col;
      const startRow = startPos.row;
      const startCols = startPos.cols || cfg.cols;
      const startRows = startPos.rows || cfg.defaultRows;
      const startWidthPx = startPos.widthPx || widgetRect.width;
      const startHeightPx = startPos.heightPx || widgetRect.height;
      const startPx = e.clientX;
      const startPy = e.clientY;

      const minCols = cfg.minCols || 1;
      const maxCols = cfg.maxCols || gridCols;
      const minRows = cfg.minRows || 1;
      const maxRows = cfg.maxRows || gridRows;
      const minWidthPx = 140;
      const minHeightPx = 80;

      const onMove = (moveEv) => {
        const dx = moveEv.clientX - startPx;
        const dy = moveEv.clientY - startPy;

        let newWidthPx = startWidthPx;
        let newHeightPx = startHeightPx;

        if (direction === "right" || direction === "top-right" || direction === "bottom-right") {
          newWidthPx = Math.max(minWidthPx, startWidthPx + dx);
        } else if (direction === "left" || direction === "top-left" || direction === "bottom-left") {
          newWidthPx = Math.max(minWidthPx, startWidthPx - dx);
        }

        if (direction === "bottom" || direction === "bottom-left" || direction === "bottom-right") {
          newHeightPx = Math.max(minHeightPx, startHeightPx + dy);
        } else if (direction === "top" || direction === "top-left" || direction === "top-right") {
          newHeightPx = Math.max(minHeightPx, startHeightPx - dy);
        }

        const deltaCols = Math.round(dx / cellWidth);
        const deltaRows = Math.round(dy / cellHeight);

        let newCol = startCol;
        let newRow = startRow;
        let newCols = startCols;
        let newRows = startRows;

        // Horizontal
        if (direction === "right" || direction === "top-right" || direction === "bottom-right") {
          newCols = Math.max(minCols, Math.min(maxCols, Math.max(1, Math.round(newWidthPx / cellWidth))));
        } else if (direction === "left" || direction === "top-left" || direction === "bottom-left") {
          newCols = Math.max(minCols, Math.min(maxCols, startCols - deltaCols));
          newCol = Math.max(1, startCol + (startCols - newCols));
        }

        // Vertical
        if (direction === "bottom" || direction === "bottom-left" || direction === "bottom-right") {
          newRows = Math.max(minRows, Math.min(maxRows, Math.max(1, Math.round(newHeightPx / cellHeight))));
        } else if (direction === "top" || direction === "top-left" || direction === "top-right") {
          newRows = Math.max(minRows, Math.min(maxRows, startRows - deltaRows));
          newRow = Math.max(1, startRow + (startRows - newRows));
        }

        setPositions((prev) => ({
          ...prev,
          [widgetId]: {
            ...prev[widgetId],
            col: newCol,
            row: newRow,
            cols: newCols,
            rows: newRows,
            widthPx: newWidthPx,
            heightPx: newHeightPx,
          },
        }));
      };

      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [gridCols, gridRows, widgetConfigs],
  );

  /* ── Drag Event Handlers ── */
  const handleDragStart = (event) => {
    const { active, delta } = event;
    if (!active) return;
    const cfg = widgetConfigs[active.id];
    if (!cfg) return;

    const currentCols = positions[active.id]?.cols || cfg.cols;
    const currentRows = positions[active.id]?.rows || cfg.defaultRows || 2;
    const initialRect = active.rect.current.initial;
    const target = cellFromTranslatedRect(
      initialRect,
      delta,
      active.id,
      gridRef.current,
      gridCols,
      gridRows,
      currentRows,
      currentCols,
      widgetConfigs,
    );
    if (!target) return;

    const valid = canPlace(
      active.id,
      target.col,
      target.row,
      positions,
      activeWidgets,
      gridCols,
      gridRows,
      currentRows,
      currentCols,
      widgetConfigs,
    );

    setGhostInfo({
      col: target.col,
      row: target.row,
      cols: currentCols,
      rows: currentRows,
      valid,
    });
  };

  const handleDragMove = (event) => {
    const { active, delta } = event;
    if (!active) return;
    const cfg = widgetConfigs[active.id];
    if (!cfg) return;

    const currentCols = positions[active.id]?.cols || cfg.cols;
    const currentRows = positions[active.id]?.rows || cfg.defaultRows || 2;
    const initialRect = active.rect.current.initial;
    const target = cellFromTranslatedRect(
      initialRect,
      delta,
      active.id,
      gridRef.current,
      gridCols,
      gridRows,
      currentRows,
      currentCols,
      widgetConfigs,
    );
    if (!target) {
      setGhostInfo(null);
      return;
    }

    const valid = canPlace(
      active.id,
      target.col,
      target.row,
      positions,
      activeWidgets,
      gridCols,
      gridRows,
      currentRows,
      currentCols,
      widgetConfigs,
    );

    setGhostInfo({
      col: target.col,
      row: target.row,
      cols: currentCols,
      rows: currentRows,
      valid,
    });
  };

  const handleDragEnd = (event) => {
    const { active, delta } = event;
    setGhostInfo(null);
    if (!active) return;

    const cfg = widgetConfigs[active.id];
    if (!cfg) return;

    const currentCols = positions[active.id]?.cols || cfg.cols;
    const currentRows = positions[active.id]?.rows || cfg.defaultRows || 2;
    const initialRect = active.rect.current.initial;
    const target = cellFromTranslatedRect(
      initialRect,
      delta,
      active.id,
      gridRef.current,
      gridCols,
      gridRows,
      currentRows,
      currentCols,
      widgetConfigs,
    );
    if (!target) return;

    if (
      canPlace(
        active.id,
        target.col,
        target.row,
        positions,
        activeWidgets,
        gridCols,
        gridRows,
        currentRows,
        currentCols,
        widgetConfigs,
      )
    ) {
      setPositions((prev) => ({
        ...prev,
        [active.id]: {
          ...prev[active.id],
          col: target.col,
          row: target.row,
          cols: currentCols,
          rows: currentRows,
        },
      }));
    }
  };

  const handleDragCancel = () => {
    setGhostInfo(null);
  };

  /* ── Render widget by ID ── */
  const renderWidget = (id, dragHandleProps) => {
    switch (id) {
      case "timer":
        return <Timmer dragHandleProps={dragHandleProps} />;
      case "waterReminder":
        return <WaterReminder dragHandleProps={dragHandleProps} goalMl={waterGoalMl} />;
      case "todo":
        return <Todo dragHandleProps={dragHandleProps} />;
      case "importantTabs":
        return <ImportantTabs dragHandleProps={dragHandleProps} tabsConfig={importantTabsConfig} />;
      case "streakGrid":
        return <StreakGrid dragHandleProps={dragHandleProps} />;
      case "songPlayer":
        return <SongPlayer dragHandleProps={dragHandleProps} playlistUrl={songPlaylistUrl} autoPlay={songAutoPlay} customVideo={songCustomVideo} stations={lofiStations} />;
      case "timeBoxing":
        return (
          <TimeBoxing
            dragHandleProps={dragHandleProps}
            externalGroups={timeBoxingGroups}
            onGroupsChange={onTimeBoxingGroupsChange}
          />
        );
      // case "clock":
      //   return null;
      default:
        return null;
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div
        ref={gridRef}
        className="dashboard-grid"
        style={{
          gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
          gridTemplateRows: `repeat(${gridRows}, 1fr)`,
        }}
      >
        {/* Ghost drop-target indicator */}
        {ghostInfo && (
          <div
            className={`grid-ghost ${ghostInfo.valid ? "" : "grid-ghost--invalid"}`}
            style={{
              gridColumn: `${ghostInfo.col} / span ${ghostInfo.cols}`,
              gridRow: `${ghostInfo.row} / span ${ghostInfo.rows}`,
            }}
          />
        )}

        {/* Place each active widget in its grid cell */}
        {Object.entries(widgetConfigs).map(([id, config]) => {
          if (!activeWidgets[id]) return null;
          const pos = positions[id] || getDefaultPositions(deviceTier)[id] || { col: 1, row: 1, rows: 2 };
          if (!pos) return null;

          return (
            <DraggableWidget
              key={id}
              id={id}
              config={config}
              pos={pos}
              onStartResize={handleStartResize}
              renderWidget={renderWidget}
            />
          );
        })}
      </div>
    </DndContext>
  );
};

export default DashboardGrid;
