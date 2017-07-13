// Generated by LiveScript 1.4.0
(function(){
  var audio;
  audio = document.createElement('audio');
  Polymer({
    is: 'audio-player',
    properties: {
      sync: {
        type: Boolean,
        value: false
      },
      tracks: {
        type: Array
      },
      provider: {
        type: String
      },
      timer: {
        type: Boolean,
        value: false
      },
      metas: {
        type: Boolean,
        value: false
      },
      progressBar: {
        type: Boolean,
        value: false,
        notify: true
      },
      progress: {
        type: Number,
        value: 0
      },
      duration: {
        type: Number,
        value: 0,
        notify: true
      },
      currentTime: {
        type: Number,
        value: 0,
        notify: true
      },
      data: {
        type: Object,
        notify: true
      },
      streamable: {
        type: Boolean,
        value: true
      },
      artwork: {
        type: String,
        notify: true
      },
      src: {
        type: String,
        notify: true
      },
      playing: {
        type: String,
        notify: true,
        value: false
      },
      paused: {
        type: Boolean,
        notify: true,
        value: false
      },
      pausedAt: {
        type: Number,
        value: 0,
        notify: true
      }
    },
    listeners: {
      'keydown': 'handleKeyDown',
      'click': 'handleClick',
      'play': 'handlePlay',
      'pause': 'handlePause'
    },
    hostAttributes: {
      tabindex: 0
    },
    ready: function(){
      var app;
      this.name = "Audio player";
      this.provider = 'soundcloud';
      app = document.querySelector('#app') || document;
      app.addEventListener('pause', this.handlePause);
      return app.addEventListener('play', this.handlePlay);
    },
    attached: function(e){
      return console.log(e);
    },
    detached: function(e){
      return console.log(e);
    },
    attributeChanged: function(e){
      return console.log(e);
    },
    handleKeyDown: function(e){
      if (e.keyCode === 32) {
        return this.playPause();
      }
    },
    handleClick: function(e){
      return console.log(e);
    },
    handlePlay: function(e){
      if (this.playing && e.detail.playing !== this.src) {
        console.info(e);
        this.pausedAt = this.currentTime;
        return this.playPause();
      }
    },
    handlePause: function(e){
      if (e.detail.playing === this.src) {
        console.info(e);
        return this.playing = false;
      }
    },
    _secondesToMinutesAndSeconds: function(seconds){
      var minutes;
      if (!this.playing && this.playing !== this.src) {
        return;
      }
      minutes = Math.floor(seconds / 60);
      minutes = minutes >= 10
        ? minutes
        : '0' + minutes;
      seconds = Math.floor(seconds % 60);
      seconds = seconds >= 10
        ? seconds
        : '0' + seconds;
      return minutes + ':' + seconds;
    },
    _timer: function(speed){
      var self, interval;
      speed == null && (speed = 1000);
      self = this;
      return interval = window.setInterval(function(){
        var progress;
        if (self.currentTime === audio.duration) {
          self.pausedAt = self.currentTime;
          self.pause();
          window.clearInterval(interval);
        }
        if (self.playing === self.src) {
          self.currentTime = audio.currentTime;
          if (!self.tracks) {
            progress = 100 * self.currentTime / self.duration;
          } else {
            progress = 100 * self.currentTime / audio.duration;
          }
          return self.set('progress', progress);
        } else {
          return window.clearInterval(interval);
        }
      }, speed);
    },
    play: function(){
      this.playing = this.src;
      this.fire('play', {
        playing: this.src,
        pausedAt: this.pausedAt
      });
      audio.src = this.src;
      audio.currentTime = this.pausedAt || 0;
      audio.play();
      if (!self.tracks) {
        return this.duration = this.data.duration / 1000.0;
      } else {
        return this.duration = audio.duration;
      }
    },
    pause: function(){
      this.pausedAt = this.currentTime;
      this.playing = false;
      this.fire('pause', {
        pausedAt: this.pausedAt,
        playing: this.src
      });
      return audio.pause();
    },
    playPause: function(e){
      var self;
      self = this;
      if (audio.readyState && this.currentTime === audio.duration) {
        audio.currentTime = 0;
        this.currentTime = 0;
        this.pausedAt = this.currentTime;
      }
      if (!this.playing) {
        this.play();
        return this._timer();
      } else {
        return this.pause();
      }
    },
    seek: function(e){
      var percent, time;
      percent = e.offsetX / e.target.offsetWidth || (e.layerX - e.target.offsetLeft) / e.target.offsetWidth;
      time = percent * this.duration || 0;
      audio.currentTime = time;
      if (this.currentTime === audio.duration) {
        this.playPause();
      }
      if (audio.src !== this.src) {
        this.pausedAt = audio.currentTime;
        return this.playPause();
      }
    }
  });
}).call(this);