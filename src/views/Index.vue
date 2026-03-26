<template>
    <div class="container">
        <h2>视频无水印解析</h2>

        <input v-model="videoUrl" placeholder="粘贴抖音 / 小红书链接" @keyup.enter="parseVideo" />
        <button @click="parseVideo" :disabled="loading">
            {{ loading ? "解析中..." : "开始解析" }}
        </button>

        <video v-if="videoUrlResult" :src="videoUrlResult" controls
            style="width:100%;margin-top:20px;border-radius:10px"></video>

        <button v-if="videoUrlResult" @click="downloadVideo" style="background:#07c160;margin-top:10px">
            下载视频
        </button>
    </div>
</template>

<script setup>
import { ref } from "vue";

const videoUrl = ref("");
const loading = ref(false);
const videoUrlResult = ref("");

// 👉 唯一支持 CORS、无跨域、网页可直接调用
async function parseVideo() {
    if (!videoUrl.value) {
        alert("请输入视频链接");
        return;
    }

    loading.value = true;
    videoUrlResult.value = "";

    try {
        const resp = await fetch(
            "https://vx-cors.deno.dev/api?url=" + encodeURIComponent(videoUrl.value)
        );
        const data = await resp.json();

        if (data.url) {
            videoUrlResult.value = data.url;
            alert("解析成功！");
        } else {
            alert("解析失败：" + (data.msg || "无法解析"));
        }
    } catch (e) {
        alert("网络异常，请重试");
    } finally {
        loading.value = false;
    }
}

// 下载视频
function downloadVideo() {
    const a = document.createElement("a");
    a.href = videoUrlResult.value;
    a.download = "video.mp4";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
</script>

<style scoped>
    .container {
        max-width: 500px;
        margin: 50px auto;
        padding: 20px;
    }

    input {
        width: 100%;
        padding: 12px;
        margin: 10px 0;
        border: 1px solid #ddd;
        border-radius: 8px;
    }

    button {
        width: 100%;
        padding: 12px;
        background: #007aff;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
    }
</style>