import antfu from '@antfu/eslint-config'

export default antfu(
  {
    react: true,
    typescript: true,
  },
  {
    rules: {
      'ts/consistent-type-definitions': ['error', 'type'],
    },
  },
)
