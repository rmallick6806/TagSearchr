//app.js 

//Global variable page set to 1. Each JSON loads by page with 100 images per page. 
var page = 1;
//Initializes custom Bootstrap Dropdown 
$("select").selectpicker();


//The main image searching function
function imgSearch() {

    //Below are the arguements used in the flickr.photos.search method. Tags are the search inputs by user; sortType is the order type of the images deteremined by the "sort" dropdown.
    //tagMode determines either 'any' for an OR combination of tags, or 'all' for an AND combination. Defaults to 'any' if not specified. 
    var tags = $("#searchterm").val();
    var sortType = $("#sort").val();
    var tagMode = $("#searchType").val();
    //The REST request format. JSON format arguement is used to return a JSON document. 
    var url = 'https://api.flickr.com/services/rest/?&method=flickr.photos.search&api_key=b7515ae0496355ba0e541d7f44867cb3&sort=' + sortType + '&page=' + page + '&tags=' + tags + '&format=json&tag_mode=' + tagMode + '&nojsoncallback=1';

    //JQuery action to remove the toggle class from prev/next/load more buttons after search is initialized so as to un-hide the buttons.
    $(".toggle").attr("class","")

    //JQuery action to get the JSON document from the request with the .done() callback. 
    $.getJSON(url).done(function(data) {
        //.each() method seeks each img object within the data.photos.photo data set. 
        $.each(data.photos.photo, function(i, obj) {
            //imgUrl puts together the URL from the pulled object data. Flickr API document provided the URL specifications
            var imgUrl = 'https://farm' + obj.farm + '.staticflickr.com/' + obj.server + '/' + obj.id + '_' + obj.secret + '.jpg'
            var imgTitle = obj.title;
            //Inserts the image into the figure containers in the HTML
            $("<img>").attr("src", imgUrl).attr("data-title", imgTitle).appendTo("#images");
            //Inserts figure captions to each image that has a title 
            $("<figcaption>").text(imgTitle).appendTo("#images");

        });

    });

}
//Detects if 'Enter' has been pressed so as to start the image search.
$(document).keyup(function(event) {
    if (event.keyCode == '13') {
        $("#search").click();
    }
});

//Searchs for the inputted tags using the image search function after search button has been clicked. TODO: As a bugfix, implement an if-else statement that checks the max number of pages in the request, and stops the user from incrementing higher. 
$('#search').click(function() {
    page = 1;
    //the .remove() method is used to remove the images after every search. 
    $("img").remove()
    $("figcaption").remove()
    imgSearch();
});

//Requests and loads the next page of images. Page counter is used to increment each page. 
$("#next-page").click(function() {
    page = page + 1;
    $("img").remove()
    $("figcaption").remove()
    imgSearch();
});

//Requests and loads the previous page of images.
$("#prev-page").click(function() {
    //BUG FIX: A simple if-else statement to prevent the user from going into the negative pages. 
    if (page > 1) {
        page = page - 1;
        $("img").remove()
        $("figcaption").remove()
        imgSearch();
    } else {
        //Alerts the user there are no previous pages. 
        alert("Cannot go further back!");
    }
});

//Loads more images on click. TODO: Implement 'lazy loading' or 'infinite loading' by activating the load button after scrolling to end of the page.
$("#load").click(function() {
    page = page + 1;
    imgSearch();
});


$("#asc-button").click(function(){
 reorderImgs('asc');
});

$("#desc-button").click(function(){
 reorderImgs('desc');
});


function reorderImgs(order) {
 var imgs = $('img');
 var sortedImgs = [];
 $.each(imgs, function(i, img){
   sortedImgs = imgs.sort(function(a, b){
     if (order === 'desc'){
       var firstGreater = $(a).attr('data-title') < $(b).attr('data-title');
       return firstGreater ? 1 : -1;
     } else if (order === 'asc') {
       var firstLower = $(a).attr('data-title') > $(b).attr('data-title');
       return firstLower ? 1 : -1;
     }
   })
 });
  $("img").remove()
  $("figcaption").remove()
 $.each(sortedImgs, function(i, img){
    var imgContainer =  "<div class='img-container'>" +
                         img.outerHTML +
                         "<figcaption>" + img.dataset.title + "</figcaption>" +
                       "</div>";
   $('#images').append($(imgContainer));
 });
};

//Features/Bug Fixes to implement in future:
//1) Sort Images on Page Function: Allow the users to sort images on page alphabetically by comparing data-title attributes
//2) Remove ability to sort JSON by relevance, date, and etc before performing a new search. Currently next/prev./load more buttons draws sortType. 
