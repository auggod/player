" ===========================
" Project specific vimrc
" ===========================

" Display js normally
set wildignore-=*.js

if has("gui_running")
  set guifont=Inconsolata:h18
endif

" Switch background light/dark at sunrise/sunset

let hour = strftime("%H")
if 6 <= hour && hour < 16
  set background=light
else
  set background=dark
endif
