module.exports = {
  apps : [
      {
        name: "gotattoo-api",
        script: "/root/gotattoo-api/dist/server.js",
        watch: true,
        env: {
          "APP_URL": "https://gotattoo.app/api/",
          "APP_SECRET": "rlopeslameira@gobarber",
          "DB_DIALECT": "mysql",
          "DB_HOST": "mysql.drconsultoria.uni5.net",
          "DB_USER": "drconsultoria",
          "DB_PASSWORD": "1drconsultoria",
          "DB_NAME": "drconsultoria"
        }
      }
  ]
}