<template>
  <header class="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-700 shrink-0">
    <div class="flex items-center gap-3">
      <h1 class="text-lg font-bold text-white flex items-center gap-2">
        <img src="/favicon.svg" alt="百里封面设计" class="w-6 h-6" />
        百里封面设计
      </h1>
    </div>
    <div class="flex items-center gap-2">
      <button
        class="px-3 py-1.5 text-xs bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
        @click="$emit('theme')"
      >
        主题选择
      </button>
      <button
        class="px-3 py-1.5 text-xs bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
        @click="$emit('save')"
      >
        保存配置
      </button>
      <button
        class="px-3 py-1.5 text-xs bg-slate-700 text-red-400 rounded-lg hover:bg-slate-600 transition-colors"
        @click="$emit('reset')"
      >
        重置配置
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
defineEmits<{ theme: []; save: []; reset: [] }>()
</script>
