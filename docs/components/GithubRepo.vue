<template>
    <VPLink class="github-repo" :href="link" :rel="rel" :no-icon="true" :tag="link ? 'a' : 'div'">
        <article class="box">
        <VPImage
            v-if="typeof icon === 'object'"
            :image="icon"
            :alt="icon.alt"
            :height="icon.height || 48"
            :width="icon.width || 48"
        />
        <div v-else-if="icon" class="icon" v-html="icon"></div>
        <h2 class="title" v-html="title"></h2>
        <p v-if="details" class="details" v-html="details"></p>

        <div v-if="linkText" class="link-text">
            <p class="link-text-value">
            {{ linkText }} <VPIconArrowRight class="link-text-icon" />
            </p>
        </div>
        </article>
    </VPLink>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import type { DefaultTheme } from 'vitepress/theme'
import VPLink from './VPLink.vue'
import VPImage from './VPImage.vue'

const repo = ref(":")   
import VPIconArrowRight from './icons/VPIconArrowRight.vue'

defineProps<{
  icon?: DefaultTheme.FeatureIcon
  title: string
  details?: string
  link?: string
  linkText?: string
  rel?: string
}>()

onMounted((()=>{
    fetch("https://api.github.com/repos/zhangfisher/voerka-i18n").then(response=>{
        response.json().then(data=>{
            console.log("data=",data )
            repo.value=data.name
        }) 
    })
    repo.value="hello"
}))

</script>

<script>
export default {
    name: 'GithubRepo',
    props: {
        repo: {
            type: String
        }
    },
    data() {
        return {
            count: 0    
        }  
    }
}
</script>

<style scoped>
.github-repo {
  display: block;
  border: 1px solid var(--vp-c-bg-soft);
  border-radius: 12px;
  height: 100%;
  background-color: var(--vp-c-bg-soft);
  transition: border-color 0.25s, background-color 0.25s;
}

.github-repo.link:hover {
  border-color: var(--vp-c-brand-1);
}

.box {
  display: flex;
  flex-direction: column;
  padding: 24px;
  height: 100%;
}

.github-repo:deep(.VPImage) {
  margin-bottom: 20px;
}

.icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  border-radius: 6px;
  background-color: var(--vp-c-default-soft);
  width: 48px;
  height: 48px;
  font-size: 24px;
  transition: background-color 0.25s;
}

.title {
  line-height: 24px;
  font-size: 16px;
  font-weight: 600;
}

.details {
  flex-grow: 1;
  padding-top: 8px;
  line-height: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.link-text {
  padding-top: 8px;
}

.link-text-value {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
}

.link-text-icon {
  display: inline-block;
  margin-left: 6px;
  width: 14px;
  height: 14px;
  fill: currentColor;
}
</style>
 