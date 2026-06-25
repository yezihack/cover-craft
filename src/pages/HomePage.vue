<template>
  <div class="min-h-screen flex flex-col bg-gray-950 text-gray-100">
    <AppHeader />
    <main class="flex-1">
      <!-- Hero Section -->
      <section class="relative overflow-hidden">
        <!-- Background decoration -->
        <div class="absolute inset-0 pointer-events-none">
          <div class="absolute top-20 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
          <div class="absolute bottom-20 right-1/4 w-80 h-80 bg-emerald-400/8 rounded-full blur-3xl" />
        </div>

        <div class="relative max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
          <!-- Logo & Title -->
          <div class="mb-6">
            <img src="/favicon.svg" alt="百里封面设计" class="w-16 h-16 mx-auto mb-4" />
            <h1 class="text-5xl font-bold tracking-tight">
              <span class="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">百里封面设计</span>
            </h1>
            <p class="mt-3 text-lg text-slate-400">Cover Craft · 一站式封面图生成工具</p>
          </div>

          <p class="max-w-2xl mx-auto text-slate-400 leading-relaxed">
            无需设计软件，浏览器即用。自由调整背景、图标、文字与水印，
            实时预览效果，一键导出高质量封面图。专为博客作者、公众号运营、开发者等内容创作者打造。
          </p>

          <!-- CTA -->
          <div class="mt-10">
            <router-link
              to="/editor"
              class="inline-flex items-center gap-2 px-8 py-3.5 bg-green-500 hover:bg-green-400 text-gray-950 font-semibold rounded-xl text-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
            >
              开始设计
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </router-link>
          </div>
        </div>
      </section>

      <!-- Feature Cards -->
      <section class="relative max-w-5xl mx-auto px-6 pb-20">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Card 1 -->
          <div class="group relative bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-green-500/30 transition-all duration-300 hover:bg-slate-900/95">
            <div class="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
              <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-slate-200 mb-2">自由定制背景</h3>
            <p class="text-sm text-slate-500 leading-relaxed">
              纯色、渐变或图片背景随心切换，支持透明度调节与多种渐变方向，打造独一无二的封面底色。
            </p>
          </div>

          <!-- Card 2 -->
          <div class="group relative bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-green-500/30 transition-all duration-300 hover:bg-slate-900/95">
            <div class="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
              <svg class="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-slate-200 mb-2">多文本图层</h3>
            <p class="text-sm text-slate-500 leading-relaxed">
              支持任意数量的文本图层，自由调整字体、大小、颜色、位置，轻松排版封面标题与副标题。
            </p>
          </div>

          <!-- Card 3 -->
          <div class="group relative bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-green-500/30 transition-all duration-300 hover:bg-slate-900/95">
            <div class="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-500/20 transition-colors">
              <svg class="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-slate-200 mb-2">一键高清导出</h3>
            <p class="text-sm text-slate-500 leading-relaxed">
              内置多平台尺寸预设，支持自定义分辨率与格式，一键导出 PNG/JPG/WebP 高质量封面图片。
            </p>
          </div>
        </div>
      </section>
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
</script>
