

module.exports = app => {
    app.db.sync().done(() => {
        console.log("Database Synced");

        app.listen(app.get("port"), () => {
            console.log(`FEAR API - Port ${app.get("port")}`);
        });
    });
};