<template>
  <footer class="border-t border-slate-800 bg-slate-900/80 backdrop-blur-sm shrink-0">
    <div class="max-w-5xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      <!-- Left: Brand -->
      <div class="text-sm text-slate-500">
        百里封面设计 · Cover Craft © 2026
      </div>

      <!-- Right: Links -->
      <div class="flex items-center gap-4">
        <!-- GitHub Star -->
        <a
          href="https://github.com/yezihack/cover-craft"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1.5 text-sm text-slate-400 hover:text-yellow-400 transition-colors"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
          </svg>
          <span>在 GitHub 上点个 Star</span>
        </a>

        <!-- Sponsor -->
        <button
          class="flex items-center gap-1.5 text-sm text-slate-400 hover:text-pink-400 transition-colors"
          @click="showSponsor = true"
        >
          <span>💖</span>
          <span>赞助支持</span>
        </button>
      </div>
    </div>

    <!-- Sponsor Modal -->
    <Teleport to="body">
      <div
        v-if="showSponsor"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
        @click.self="showSponsor = false"
      >
        <div class="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700 text-center max-w-sm mx-4">
          <h3 class="text-xl font-semibold text-slate-100 mb-2">微信支付</h3>
          <p class="text-sm text-slate-400 mb-6">感谢您的支持！</p>
          <img
            src="/wxpay.jpg"
            alt="微信支付收款码"
            class="w-56 h-56 mx-auto rounded-xl border border-slate-600 object-cover"
          />
          <p class="text-xs text-slate-500 mt-4">请使用微信扫描二维码</p>
          <button
            class="mt-6 px-6 py-2 text-sm bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
            @click="showSponsor = false"
          >
            关闭
          </button>
        </div>
      </div>
    </Teleport>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const showSponsor = ref(false)
</script>
