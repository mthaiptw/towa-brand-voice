import { useState, type FC } from 'react'
import { useFieldPlugin } from '@storyblok/field-plugin/react'

const FieldPlugin: FC = () => {
  const { type } = useFieldPlugin({
    validateContent: (content: unknown) => ({
      content: typeof content === 'number' ? content : 0,
    }),
  })

  const [isLoading, setIsLoading] = useState(false)

  const [text, setText] = useState('')
  const [textStyle, setTextStyle] = useState('')
  const [language, setLanguage] = useState('')

  const [transformedText, setTransformedText] = useState('')

  const handleTranslate = async () => {
    setIsLoading(true)

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
        setTransformedText(data.transformed_text)
        return
      }

      console.error('No transformed text is available', data)
    } catch (error) {
      console.error('Something went wrong', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (type !== 'loaded') {
    return null
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '0.5rem',
        gap: '1rem',
      }}
    >
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        style={{
          height: '4rem',
        }}
        placeholder="Text to translate"
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '1rem',
        }}
      >
        <input
          value={textStyle}
          onChange={(event) => setTextStyle(event.target.value)}
          style={{
            flex: 1,
          }}
          placeholder="Text style"
        />

        <input
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
          style={{
            flex: 1,
          }}
          placeholder="Language"
        />
      </div>

      <button
        onClick={handleTranslate}
        disabled={isLoading}
      >
        Translate
      </button>

      {transformedText && !isLoading && (
        <textarea
          style={{ minHeight: '10rem' }}
          value={transformedText}
        ></textarea>
      )}
    </div>
  )
}

export default FieldPlugin
