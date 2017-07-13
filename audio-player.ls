audio = document.createElement('audio')

Polymer do

  is: 'audio-player'

  properties:

    # Sync by default to any playing track
    sync:
      type: Boolean
      value: false

    # An array of tracks to play when track is of playlist kind, is a list of stream urls (see @src)
    tracks:
      type: Array

    # If no provider is specified default to audio file (mp3, flac), could be soundcloud or youtube
    provider:
      type: String

    # Show/hide timer
    timer:
      type: Boolean
      value: false

    # Show/hide metas
    metas:
      type: Boolean
      value: false

    # Show/hide progress bar
    progressBar:
      type: Boolean
      value: false
      notify: true

    # Current progress in ms
    progress:
      type: Number
      value: 0

    # Duration in ms
    duration:
      type: Number
      value: 0
      notify: true

    # Current time in ms same as audio element
    currentTime:
      type: Number
      value: 0
      notify: true

    # Raw track object, could be sc object or youtube
    data:
      type: Object
      notify: true

    # Sometimes soundcloud tracks are not streamable
    streamable:
      type: Boolean
      value: true

    # Artwork url
    artwork:
      type: String
      notify: true

    # The stream url
    src:
      type: String
      notify: true

    # The player is currently playing sound
    playing:
      type: String
      notify: true
      value: false

    # The player was playing and is currently paused
    paused:
      type: Boolean
      notify: true
      value: false

    pausedAt:
      type: Number
      value: 0
      notify: true

  listeners:
    'keydown': 'handleKeyDown'
    'click': 'handleClick'
    'play': 'handlePlay'
    'pause': 'handlePause'

  hostAttributes:
    tabindex: 0

  ready: ->
    @name = "Audio player"
    @provider = 'soundcloud'
    # Listen for play/pause events coming from other players
    app = document.querySelector('#app') or document
    app.addEventListener 'pause', @handlePause
    app.addEventListener 'play', @handlePlay

  attached: (e) ->
    console.log e

  detached: (e) ->
    console.log e

  attributeChanged: (e) ->
    console.log e

  handleKeyDown: (e) ->
    if e.keyCode == 32
      @playPause!

  handleClick: (e) ->
    console.log e

  handlePlay: (e) ->
    if @playing and e.detail.playing != @src
      console.info(e)
      @pausedAt = @currentTime
      @playPause!

  handlePause: (e) ->
    if e.detail.playing == @src
      console.info(e)
      @playing = false

  _secondesToMinutesAndSeconds: (seconds) ->
    if !@playing and @playing != @src
      return
    minutes = Math.floor(seconds / 60)
    minutes = if minutes >= 10 then minutes else '0' + minutes
    seconds = Math.floor(seconds % 60)
    seconds = if seconds >= 10 then seconds else '0' + seconds
    minutes + ':' + seconds

  _timer: (speed = 1000) ->
    self = @
    interval = window.setInterval ->
      if self.currentTime == audio.duration
        self.pausedAt = self.currentTime
        self.pause!
        window.clearInterval(interval)
      if self.playing == self.src
        self.currentTime = audio.currentTime
        if not self.tracks then progress = 100 * self.currentTime / self.duration else progress = 100 * self.currentTime / audio.duration
        self.set('progress', progress)
      else
        window.clearInterval(interval)
    , speed

  play: ->
    @playing = @src

    @fire('play', {
      playing: @src,
      pausedAt: @pausedAt
    })

    audio.src = @src
    audio.currentTime = @pausedAt || 0
    audio.play!

    unless self.tracks
      @duration = @data.duration / 1000.0
    else
      @duration = audio.duration

  pause: ->
    @pausedAt = @currentTime

    @playing = false

    @fire('pause', {
      pausedAt: @pausedAt
      playing: @src
    })

    audio.pause!

  playPause: (e) ->

    self = @

    if audio.readyState and @currentTime == audio.duration
      audio.currentTime = 0
      @currentTime = 0
      @pausedAt = @currentTime

    unless @playing
      @play!
      @_timer!
    else
      @pause!

  seek: (e) ->
    percent = e.offsetX / e.target.offsetWidth or (e.layerX - e.target.offsetLeft) / e.target.offsetWidth
    time = percent * @duration or 0
    audio.currentTime = time
    if @currentTime == audio.duration
      @playPause!
    unless audio.src == @src
      @pausedAt = audio.currentTime
      @playPause!
