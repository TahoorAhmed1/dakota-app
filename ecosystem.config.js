module.exports = {
  apps: [
    {
      name: "dakota-app",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
}
