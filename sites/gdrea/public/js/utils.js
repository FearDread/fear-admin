// Utility (helper) functions
module.exports = utils = {

    // Finds a handlebars template by id.
    // Populates it with the passed in data
    // Appends the generated html to div#order-page-container
    renderPageTemplate: function(templateId, data) {
        var _data = data || {};
        var templateScript = $(templateId).html();
        var template = Handlebars.compile(templateScript);


        // Empty the container and append new content
        $("#page-container").empty();

        // Empty the container and append new content
        $("#page-container").append(template(_data));
    },

    // If a hash can not be found in routes
    // then this function gets called to show the 404 error page
    pageNotFoundError: function() {

        var data = {
            errorMessage: "404 - Page Not Found"
        };
        this.renderPageTemplate("#error-page-template", data);
    },

    // Fetch json data from the given url
    // @return promise
    fetch: function(url, data) {
        var _data = data || {};
        return $.ajax({
            context: this,
            url: window.location.origin + "/" + url,
            data: _data,
            method: "GET",
            dataType: "JSON"
        });
    }
};