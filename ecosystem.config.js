module.exports = {
  apps: [
    {
      name: 'KataBank',
      script: './dist/main.js',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}
