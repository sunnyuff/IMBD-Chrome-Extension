/**
 * 
 * @returns return function on jquery ready.
 */
//"use strict";
$(function () {
    var ajaxReq = null;
    /**
     * Reset button click handler.
     */
    $('#search-reset').click(function () {
        if(ajaxReq !== null) ajaxReq.abort();
        $('#t').val('');
        $('#y').val('');
        $('#result').text('');
        $('.loader').hide();
    });
    /**
     * Search button click handler.
     * Getting form data and posting to OMDB APIS.
     * calling crossponding based on response.
     */
    $("#search-submit").click(function () {
        if($('#t').val().length < 2) {
            displayError('{"Response":"False","Error":"Must provide more than one character."}');
            return false;
        }
        
        var data = $("form").serialize();
        $('.loader').show();
        ajaxReq = $.ajax({
            type: "POST",
            dataType: 'json',
            url: 'http://www.omdbapi.com/?' + data,
            success: function (response) {
                if (response.Response === "False") {
                    displayError(response);
                }
                else {
                    buildhtml(response);
                }
                $('.loader').hide();
            },
            error: function (response) {
                displayError(response);
                $('.loader').hide();
            }
        });
        return false;
    });

    /**
     * Submitting the form if user presses enter.
     */
    $('#t, #y').keypress(function (e) {
        // Enter pressed?
        if (e.which == 10 || e.which == 13) {
            $('#search-submit').trigger('click');
        }
    });
});

/**
 * 
 * @param JSON response form OMDB APIS.
 * @returns HTML output for the popup.
 */
function buildhtml(data) {
    var Poster = (data.Poster.length > 50) ? data.Poster : "img/not-found.png";
    var html = "";
    html += '<div class="wrapper">';
    html += '<h1 id="title-year">' + '<a href="http://www.imdb.com/title/' + data.imdbID + '?ref=sunnyuff" target="_blank">' + data.Title + '  (' + data.Year + ')</a></h1>';
    html += '<h3>Rated <span id="rated">' + data.Rated + ' | <span> Released <span id="released">' + data.Released + '<span></h3>';
    html += '<h5>Runtime <span id="runtime">' + data.Runtime + ' | <span> Genre <span id="genre">' + data.Genre + '<span></h5>';
    html += '<div class="img-wrap">';
    html += '<a href="http://www.imdb.com/title/' + data.imdbID + '?ref=sunnyuff" target="_blank">';
    html += '<img width="300" class="poster" src=' + Poster + '/>';
    html += '<div class="rating">' + data.imdbRating + '</div>';
    html += '</a>';
    html += '</div>';
    html += '<div class="plot">' + data.Plot;
    html += '</div>';
    html += '<div class="desc"><div class="director">Director : ' + data.Director + '</div>';
    html += '<div class="writer"> Writer : ' + data.Writer + '</div>';
    html += '<div class="stars">Stars : ' + data.Actors + '</div>';
    html += '<div class="Language">Language : ' + data.Language + '</div>';
    html += '<div class="metascore">Metascore : ' + data.Metascore + '/100</div>';
    html += '</div></div>';
    $('#result').html(html);
}

/**
 * 
 * @param JSON response from OMDB APIS.
 * @returns HTML incase of errors.
 */
function displayError(data) {
    $('#result').html("<div class='error'>" + data.Error + "</div>");
}












