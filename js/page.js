var $ = require('jquery');

module.exports = {
  setLayout :   function setLayout(){
    if(innerHeight*1.3 < innerWidth){
      $("#buttons").removeClass().addClass('uk-width-1-4');
      $("#algo").removeClass().addClass('uk-width-1-4');
      $("#sp").removeClass().addClass('uk-width-1-4');
      $("#size").removeClass().addClass('uk-width-1-4')
    } else{
      $("#buttons").removeClass().addClass('uk-width-1-2');
      $("#algo").removeClass().addClass('uk-width-1-2');
      $("#sp").removeClass().addClass('uk-width-1-2');
      $("#size").removeClass().addClass('uk-width-1-2')
    }
  },
  
  createAbout : function createAbout(){
    $('body').append('<div class = "about"><div class = "about_content"></div><div class = "about_exit"></div></div>');
    
    $('.about_content').append('<h1>About</h1><br/>' + 
                       '<p>The visualisation is created by <a target = "_blank" href = "https://github.com/AIRTucha">Alexey Tukalo</a> for Advanced Algorithms and Data Structures course at <a target = "_blank" href = "http://portal.savonia.fi/amk/">Savonia University of Applied Sciences</a>.' +
                       '<p>The visualisation represents sevent the most common sorting algorithms and gives user an opportunity to brows thought them in a different way.</p>' +
                      '<p>You are welcome to fork and improve the framework on <a target = "_blank" href = "https://github.com/AIRTucha/SortVis">GitHub</a>.</p>');
      
      $('a').css({'color' : '#AA0077'});
    
      $(".about_exit").click(function(){ $(".about").fadeOut(500)});
      $(".about").hide();
  }
}