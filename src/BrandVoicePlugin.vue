<script setup lang="ts">
import './example.css'
import { useFieldPlugin } from '@storyblok/field-plugin/vue3'
import { onMounted, ref, watch } from 'vue';

const plugin = useFieldPlugin({
  validateContent: (content: unknown) => ({
    content: typeof content === 'number' ? content : 0,
  }),
})

const isLoading= ref(false)

const text = ref('')
const textStyle = ref('')
const language  = ref('')

const transformedText = ref('')

const handleTranslate = async () => {
  isLoading.value = true;

  const headers = new Headers()

  headers.append(
    'x-api-key',
    import.meta.env.VITE_BRAND_VOIDE_ENGINE_X_API_KEY,
  ) // TODO: config API key using Storyblok options
  headers.append('Content-Type', 'application/json')

  try {
    // const apiRes = await fetch(`${apiBaseUrl}/transform_text`, {
    const apiRes = await fetch(`/api/transform_text`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        input_text: 'Text of user',
        style: 'Business',
        language: 'Deutsch',
      }),
    })

    const data = await apiRes.json()

    if (data.transformed_text) {
      transformedText.value = data.transformed_text
      return
    }

    console.error('No transformed text is available', data)
  } catch (error) {
    console.error('Something went wrong', error)
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div v-if="plugin.type === 'loaded'">
    <div
      :style="{
        display: 'flex',
        flexDirection: 'column',
        padding: '0.5rem',
        gap: '1rem',
      }"
    >
      <textarea
        :value="text"
        @change="(event) => text = event.target.value"
        :style="{
          height: '4rem',
        }"
        placeholder="Text to translate"
      />

      <div
        :style="{
          display: 'flex',
          flexDirection: 'row',
          gap: '1rem',
        }"
      >
        <input
          :value="textStyle"
          @change="(event) => textStyle = event.target.value"
          :style="{
            flex: 1,
          }"
          placeholder="Text style"
        />

        <input
          :value="language"
          @change="(event) => language = event.target.value"
          :style="{
            flex: 1,
          }"
          placeholder="Language"
        />
      </div>

      <button
        @click="handleTranslate"
        :disabled="isLoading"
      >
        Translate
      </button>

      <textarea
        v-if="transformedText && !isLoading"
        :style="{ minHeight: '10rem' }"
        :value="transformedText"
      />
    </div>
  </div>
</template>
