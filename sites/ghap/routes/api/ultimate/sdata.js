var $, sdeta, utils, path, assert;

path = '../../../';

assert = require('assert');
utils = require(path + 'src/utils');
sdata = require(path + 'src/config/sdata.js');

exports.add = function (app) {

    app.route('/ut/sdata')
      
        .get(function (req, res) {
            return res.json({sdata: sdata});
        });

    app.route('/ut/sdata/rank')

        .get(function (req, res) {
            var ranks, results;

            ranks = sdata.getRankings()
                
                .success(function (data) {

                    if (data) {
                        results = JSON.parse(data);

                        return res.json({
                            success: true,
                            data: results,
                            status: 200
                        });
                    }
                })
                .error(function (err) {
                  if (err) {
                    return res.json(utils.addError(err));
                  }
                });
        });

    app.route('/ut/sdata/standing')

        .get(function (req, res) {
            var standings, results;

            standings = sdata.getStandings()

                .success(function (data) {
                    if (data) {
                        results = JSON.parse(data);

                        return res.json({
                            success: true,
                            data: results,
                            status: 200
                        });
                    }
                })
                .error(function (err) {
                  if (err) {
                    return res.json(utils.addError(err));
                  }
                });
        });

    app.route('/ut/sdata/season')

        .get(function (req, res) {
            var season, results;

            season = sdata.getSeason()
                
                .success(function (data) {
                    if (data) {
                        results = JSON.parse(data);

                        return res.json({
                            success: true,
                            data: results,
                            status: 200
                        });
                    }
                })
                .error(function (err) {
                  if (err) {
                    return res.json(utils.addError(err));
                  }
                });
        });

    app.route('/ut/sdata/schedule')
        
        .get(function (req, res) {
            var schedule, results;

            schedule = sdata.getSchedule()
              
                .success(function (data) {
                    if (data) {
                        results = JSON.parse(data);

                        return res.json({
                            success: true,
                            data: results,
                            status: 200
                        });
                    }
                })
                .error(function (err) {
                  if (err) {
                    return res.json(utils.addError(err));
                  }
                });
        });

    app.route('/ut/sdata/injury')
        
        .get(function (req, res) {
            var injuries, results;

            injuries = sdata.getInjuries()
                
                .success(function (data) {
                    if (data) {
                        results = JSON.parse(data);

                        return res.json({
                            success: true,
                            data: results,
                            status: 200
                        });
                    }
                })
                .error(function (err) {
                  if (err) {
                    return res.json(utils.addError(err));
                  }
                });
        });

    app.route('/ut/sdata/odds')

        .get(function (req, res) {
            var odds, results;

            odds = sdata.getOdds()

                .success(function (data) {
                    if (data) {
                        results = JSON.parse(data);

                        return res.json({
                            success: true,
                            data: results,
                            status: 200
                        });
                    }
                })
                .error(function (err) {
                  if (err) {

                    return res.json(utils.addError(err));
                  }
                });
        });
};
