/* Pomodoro Audio
 * Just a simple wrapper for HTML5's native Audio functionality
 * Browswer audio support is sketchy.  Some browsers only allow audio to play
 * in response to user action, so we have to build a little workaround to
 * capture a user click and start the audio then.
 */

PomodoroArcade.Models.PomAudio = (function (){
  var create, PAudio;

  /*  TODO: ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   *    This code was an attempt to get better mobile browser support for audio
   *    It's a work in progress and will need to get back to it later
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  //PAudio = function (path_to_file){
  //  var playListener, clickListener, listenerRef;
  //  this.file_path = path_to_file;
  //  this.user_audio = new Audio(this.file_path);
  //  this.simple_audio = new Audio(this.file_path);
  //  this.was_clicked = false;

  //  playListener = function (){
  //    // When the audio is ready to play, immediately pause.
  //    this.user_audio.pause();
  //    this.was_clicked = true;
  //    this.user_audio.removeEventListener('play', arguments.callee, false);
  //    //this.user_audio.removeEventListener('play', playListener.bind(this), false);
  //    //console.log(this.user_audio.removeEventListener('play'));
  //  };

  //  // Start playing audio when the user clicks anywhere on the page,
  //  // to force Mobile Safari to load the audio.
  //  clickListener = function (){
  //    document.removeEventListener('click', arguments.callee, false);
  //    //document.removeEventListener('click', clickListener, false);
  //    this.user_audio.play();
  //  };

  //  this.user_audio.addEventListener('play', playListener.bind(this), false);
  //  document.addEventListener('click', clickListener.bind(this), false);
  //};

  //PAudio.prototype.play = function (){
  //  //(this.was_clicked) ? (this.user_audio.play()) : (this.simple_audio.play());
  //  if(this.was_clicked){
  //    console.log("DEBUG: screen was clicked, we can play the triggered audio");
  //    this.user_audio.play()
  //  }else{
  //    console.log("DEBUG: screen was not clicked, going to attempt to play simple audio");
  //    this.simple_audio.play();
  //  }
  //};

  //PAudio.prototype.destroy = function (){
  //  delete this.user_audio;
  //  delete this.simple_audio;
  //};

  PAudio = function (path_to_file){
    var playListener, clickListener, listenerRef;
    this.file_path = path_to_file;
    console.log("DEBUG: INITIALIZING AUDIO OBJ WITH PATH ----> "+ this.file_path);
    this.audio = new Audio(this.file_path);
  };

  PAudio.prototype.play = function (){
    console.log("DEBUG: in PomAudio play.... do we have an audio obj? ====>");
    console.log(this.audio);
    this.audio.play();
  };

  PAudio.prototype.destroy = function (){
    delete this.audio;
  };
  
  create = function (options){
    var path;
    path = options.path || options;
    console.log("IN POM AUDIO CREATE, PATH IS -----------> " + path);
    if(!path) { throw "Argument error, file path not present"; }
    return new PAudio(path);
  };

  return {
    create: create
  }
})();

