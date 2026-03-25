<script setup>
import { ref } from 'vue'

const inputValue = ref('')
const images = ref([])
const videos = ref([])
const loading = ref(false)
const error = ref('')
const handleSubmit = async () => {
    error.value = ''
    images.value = []
    videos.value = []
    const url = (inputValue.value || '').trim()
    if (!url) return
    loading.value = true
    try {
        const resp = await fetch(`/api/parse?url=${encodeURIComponent(url)}`)
        const data = await resp.json()
        images.value = Array.isArray(data.images) ? data.images : []
        videos.value = Array.isArray(data.videos) ? data.videos : []
        if (!images.value.length && !videos.value.length) {
            error.value = '未解析到媒体内容'
        }
    } catch (e) {
        error.value = '解析失败'
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="tool">
        <div class="nav">工具</div>
        <input type="text" placeholder="请输入..." v-model="inputValue" class="inp">
        <button class="btn" @click="handleSubmit">提交</button>
        <div style="margin-top: 10px; font-size: 12px; color: #666;">
            仅用于学习和技术研究，请遵守平台服务条款，不得用于商业或违规用途。
        </div>
        <div v-if="loading">解析中...</div>
        <div v-if="error">{{ error }}</div>
        <div v-if="videos.length">
            <div>视频</div>
            <div>
                <video v-for="(v, i) in videos" :key="'v' + i" :src="v" controls
                    style="width: 100%; max-width: 480px; margin-top: 10px;"></video>
            </div>
        </div>
        <div v-if="images.length" style="margin-top: 10px;">
            <div>图片</div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 8px;">
                <img v-for="(img, i) in images" :key="'i' + i" :src="img" style="width: 100%; object-fit: cover;">
            </div>
        </div>
    </div>
</template>
<style scoped>
    .tool {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

        .nav {
            width: 100%;
            height: 40px;
            background: #f5f5f5;
            text-align: center;
            line-height: 40px;
        }

        .inp {
            width: 80%;
            height: 40px;
            border: 1px solid #ccc;
            border-radius: 10px;
            margin-top: 20px;
        }

        .btn {
            width: 60%;
            height: 40px;
            border: 1px solid #ccc;
            border-radius: 10px;
            margin-top: 10px;
        }
    }
</style>
