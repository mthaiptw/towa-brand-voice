<script setup lang="ts">
import './styles.css'
import { useFieldPlugin } from '@storyblok/field-plugin/vue3'
import { ref } from 'vue'
import axios from 'axios'

const plugin = useFieldPlugin({
  validateContent: (content: unknown) => ({
    content: typeof content === 'number' ? content : 0,
  }),
})

const isLoading = ref(false)

const text = ref('')
const textStyle = ref([])
const language = ref('')

const transformedText = ref('')

const systemPrompt = ref('')
const openModalSystemPrompt = ref(false)

const handleTranslate = async () => {
  isLoading.value = true

  try {
    const apiRes = await axios({
      url: 'https://bve.towa.ai/transform_text',
      method: 'post',
      maxBodyLength: Infinity,
      headers: {
        'x-api-key': import.meta.env.VITE_BRAND_VOIDE_ENGINE_X_API_KEY, // TODO: config API key using Storyblok options
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        input_text: text.value,
        style: textStyle.value,
        language: language.value,
      }),
    })

    // TODO: Handle error correctly
    if (apiRes.data.transformed_text) {
      transformedText.value = apiRes.data.transformed_text
      return
    }

    console.error('No transformed text is available', apiRes.data)
  } catch (error) {
    console.error('Something went wrong', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div v-if="plugin.type === 'loaded'">
    <SbModal
      :is-open="openModalSystemPrompt"
      @hide="openModalSystemPrompt = false"
    >
      <SbModalHeader
        title="System Prompt"
        align="left"
      />
      <SbModalContent>
        <SbTextField
          type="textarea"
          v-model="systemPrompt"
        />
      </SbModalContent>
      <SbModalFooter>
        <SbButton
          label="Cancel"
          variant="tertiary"
          @click="openModalSystemPrompt = false"
        />
        <SbButton
          label="Save"
          variant="primary"
          @click="openModalSystemPrompt = false"
        />
      </SbModalFooter>
    </SbModal>

    <div
      :style="{
        display: 'flex',
        flexDirection: 'column',
        padding: '0.5rem',
        gap: '1rem',
      }"
    >
      <SbTextField
        type="textarea"
        :disabled="isLoading"
        placeholder="Text to translate"
        v-model="text"
      />

      <SbSelect
        label="Choose text style"
        :options="[
          { label: 'Corporate Wording', value: 'corporate' },
          { label: 'HR Wording', value: 'hr' },
          { label: 'Marketing Wording', value: 'marketing' },
          { label: 'Legal Wording', value: 'legal' },
        ]"
        v-model="textStyle"
      />

      <SbTextField
        placeholder="Language"
        v-model="language"
      />

      <SbButton
        @click="openModalSystemPrompt = true"
        label="Edit Prompt"
        variant="tertiary"
      />

      <SbButton
        @click="handleTranslate"
        :isLoading="isLoading"
        label="Rewrite & Improve"
      />

      <SbTextField
        v-if="transformedText && !isLoading"
        type="textarea"
        readonly
        v-model="transformedText"
      />
    </div>
  </div>
</template>
