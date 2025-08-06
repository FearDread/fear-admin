var $, config;

$ = require('najax');
config = require('../config');

module.exports = {
    endpoints:{
        odds: 'https://api.sportradar.us/odds-b1?api_key=' + config.sdata.key,
        ranks: 'https://api.sportsdatallc.org/nba-t3/seasontd/2014/reg/rankings.json?api_key=' + config.sdata.key,
        season: 'https://api.sportsdatallc.org/nba-t3/seasontd/2015/reg/teams/[team_id]/statistics.json?api_key=' + config.sdata.key,
        injuries: 'https://api.sportsdatallc.org/nba-t3/league/injuries.json?api_key=' + config.sdata.key,
        schedule: 'https://api.sportsdatallc.org/nba-t3/games/2015/reg/schedule.json?api_key=' + config.sdata.key,
        standings: 'https://api.sportsdatallc.org/nba-t3/seasontd/2015/reg/standings.json?api_key=' + config.sdata.key,
        game: 'http://api.sportsdatallc.org/nba-[access_level][version]/games/[game_id]/summary.json?api_key=' + config.sdata.key,
        series: 'http(s)://api.sportsdatallc.org/nba-[access_level][version]/series/[season]/[nba_season]/schedule.xml?api_key=' + config.sdata.key
    },
    getOdds: function () {
        return $({url:this.endpoints.odds});
    },
    getInjuries: function () {
        return $({url:this.endpoints.injuries}); 
    },
    getSeason: function () {
        return $({url:this.endpoints.season});
    },
    getSchedule: function () {
        return $({url:this.endpoints.schedule}); 
    },
    getSeries: function () {
        return $({url:this.endpoints.series});
    },
    getStandings: function () {
        return $({url:this.endpoints.standings}); 
    },
    getRankings: function () {
        return $({url:this.endpoints.ranks});
    },
    getData: function (uri, params) {
        return $({
            url: uri,
            data: (params) ? params : null
        });
    }
};
