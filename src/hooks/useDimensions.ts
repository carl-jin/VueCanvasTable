/**
 * 该 hook 主要处理各种区域的宽度，高度
 */
import { computed, ComputedRef, unref } from "vue";
import { useGlobalStore } from "@/store/global";

type ReturnType = {
  //  cells 渲染区域宽度
  stageWidth: ComputedRef<number>;
  //  cells 渲染区域高度
  stageHeight: ComputedRef<number>;
  //  columns 高度
  columnHeight: ComputedRef<number>;
  //  rows 左侧序号宽度
  rowHeaderWidth: ComputedRef<number>;
  //  滚动条宽度
  scrollbarSize: ComputedRef<number>;
  //  cells 内容宽度
  contentHeight: ComputedRef<number>;
  //  cells 内容宽度
  contentWidth: ComputedRef<number>;
  //  cells 区域裁切宽度
  cellsAreaClipWidth: ComputedRef<number>;
  //  cells 区域裁切高度
  cellsAreaClipHeight: ComputedRef<number>;
  //  冻结列 区域裁切宽度
  frozenAreaClipWidth: ComputedRef<number>;
  //  冻结列 区域裁切高度
  frozenAreaClipHeight: ComputedRef<number>;
  //  冻结 column 宽度
  frozenColumnWidth: ComputedRef<number>;
  //  冻结 rows 高度
  frozenRowHeight: ComputedRef<number>;
  //  最大的 scrollLeft 值，如果超过则会出现空白的问题
  cellsMaxScrollLeft: ComputedRef<number>;
  //  最大的 scrollTop 值，如果超过则会出现空白的问题
  cellsMaxScrollTop: ComputedRef<number>;
  //  x 轴 scrollbar 宽度
  horizonScrollBarWidth: ComputedRef<number>;
  //  y 轴 scrollbar 高度
  verticalScrollBarWidth: ComputedRef<number>;
};

let cache: ReturnType | null = null;

export function useDimensions(): ReturnType {
  if (cache) return cache;

  const globalStore = useGlobalStore();

  const width = computed(() => globalStore.width);
  const height = computed(() => globalStore.height);
  const rowHeaderWidth = computed(() => globalStore.rowHeaderWidth);
  const columnHeight = computed(() => globalStore.columnHeight);
  const scrollbarSize = computed(() => globalStore.scrollbarSize);
  const contentHeight = computed(() => globalStore.scrollState.contentHeight);
  const contentWidth = computed(() => globalStore.scrollState.contentWidth);
  const frozenColumnWidth = computed(
    () => globalStore.columnAreaBounds[globalStore.frozenColumns].left
  );
  const frozenRowHeight = computed(
    () => globalStore.rowAreaBounds[globalStore.frozenRows].top
  );

  const stageWidth = computed(() => {
    return unref(width) - unref(scrollbarSize);
  });
  const stageHeight = computed(() => {
    return unref(height) - unref(columnHeight) - unref(scrollbarSize);
  });

  const cellsAreaClipWidth = computed(
    () => unref(stageWidth) - unref(frozenColumnWidth)
  );
  const cellsAreaClipHeight = computed(
    () => unref(stageHeight) - unref(frozenRowHeight)
  );
  const frozenAreaClipWidth = computed(
    () => unref(frozenColumnWidth) + rowHeaderWidth.value
  );
  const frozenAreaClipHeight = computed(
    () => unref(stageHeight) - unref(frozenRowHeight)
  );

  const cellsMaxScrollLeft = computed(() => {
    return unref(contentWidth) - unref(stageWidth) + unref(rowHeaderWidth) + 1;
  });

  const cellsMaxScrollTop = computed(() => {
    return Math.max(unref(contentHeight) - unref(stageHeight) + 1, 0);
  });

  const horizonScrollBarWidth = computed(() => {
    return unref(stageWidth) - unref(rowHeaderWidth);
  });

  const verticalScrollBarWidth = computed(() => {
    return unref(stageHeight);
  });

  cache = {
    stageWidth,
    stageHeight,
    columnHeight,
    rowHeaderWidth,
    scrollbarSize,
    contentHeight,
    contentWidth,
    frozenColumnWidth,
    frozenRowHeight,
    cellsAreaClipWidth,
    cellsAreaClipHeight,
    frozenAreaClipWidth,
    frozenAreaClipHeight,
    cellsMaxScrollLeft,
    cellsMaxScrollTop,
    horizonScrollBarWidth,
    verticalScrollBarWidth,
  };

  return cache;
}
