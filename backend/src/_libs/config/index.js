

/*
module.exports = app => {
  return require("dotenv").config({ path: "./.env" });
}

*/
module.exports = {
  database: "ntask",
  username: "",
  password: "",
  params: {
    dialect: "sqlite",
    storage: "ntask.sqlite",
    logging: (sql) => {
      logger.info(`[${new Date()}] ${sql}`);
    },
    define: {
      underscored: true
    }
  },
  JWT_SECRET: "Nta$K-AP1",
  jwtSession: {session: false}
};
