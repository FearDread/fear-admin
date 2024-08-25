

module.exports = app => {
    app.listen(app.get("port"), () => {
        console.log(`FEAR API - Port ${app.get("port")}`);
    });
};