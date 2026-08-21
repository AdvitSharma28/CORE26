// Disable right-click context menu (UI-only)
document.addEventListener('contextmenu', function(e){ e.preventDefault(); });

// Prevent dragging of images or placeholder elements
document.addEventListener('dragstart', function(e){ e.preventDefault(); });

// Keyboard accessibility for CTAs
document.addEventListener('DOMContentLoaded', function(){
  var ctas = document.querySelectorAll('.btn-cta, .cta');
  ctas.forEach(function(el){
    el.setAttribute('tabindex','0');
    el.addEventListener('keypress', function(ev){
      if(ev.key === 'Enter' || ev.key === ' ') ev.target.click();
    });
  });

  var toggle = document.querySelector('.theme-toggle');
  var root = document.documentElement;
  function applyTheme(theme){
    if(theme === 'dark'){
      root.classList.add('dark');
      if(toggle){ toggle.setAttribute('aria-pressed','true'); }
    } else {
      root.classList.remove('dark');
      if(toggle){ toggle.setAttribute('aria-pressed','false'); }
    }
  }

  var saved = null;
  try{ saved = localStorage.getItem('theme'); }catch(e){ saved = null; }
  var themeToApply = (saved === 'light') ? 'light' : 'dark';
  applyTheme(themeToApply);

  if(toggle){
    toggle.addEventListener('click', function(){
      var isDark = root.classList.contains('dark');
      var next = isDark ? 'light' : 'dark';
      applyTheme(next);
      try{ localStorage.setItem('theme', next); }catch(e){}
      toggle.classList.add('anim');
      setTimeout(function(){ toggle.classList.remove('anim'); }, 420);
    });
  }
});

(function(){
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function heroEntrance(){
    if(prefersReduced) return;
    var label = document.querySelector('.hero-left .label');
    var title = document.querySelector('.hero-left .hero-title');
    var para = document.querySelector('.hero-left .lead');
    var cta = document.querySelector('.hero-left .btn-cta');
    var elems = [label, title, para, cta];
    elems.forEach(function(el,i){ if(!el) return; el.classList.add('reveal'); el.classList.add('stagger-'+(i+1)); });
    elems.forEach(function(el,i){ if(!el) return; setTimeout(function(){ el.classList.add('in'); }, 80*i + 120); });
  }

  function imageEntrance(){
    if(prefersReduced) return;
    var img = document.querySelector('.hero-product');
    if(!img) return;
    img.classList.add('reveal','stagger-2');
    setTimeout(function(){ img.classList.add('in'); }, 180);
  }

  function setupObservers(){
    if(!('IntersectionObserver' in window) || prefersReduced) return;
    var opts = {threshold:0.08, rootMargin:'0px 0px -4% 0px'};
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, opts);

    document.querySelectorAll('.partners .partner').forEach(function(el, idx){
      el.classList.add('reveal');
      el.style.transitionDelay = (idx*0.06)+'s';
      io.observe(el);
    });

    document.querySelectorAll('.hero-visual, .hero-left').forEach(function(el){ el.classList.add('reveal'); io.observe(el); });
    document.querySelectorAll('.contact-left, .contact-right, .social-item, .made-by, .bottom-info').forEach(function(el){ el.classList.add('reveal'); io.observe(el); });
  }

  function setupInertia(){
    var frame = document.querySelector('.hero-visual');
    var card = document.querySelector('.hero-product');
    if(!frame || !card) return;
    if(prefersReduced) return;

    var maxTranslate = 12;
    var maxRotate = 4;
    var hoverScale = 1.02;

    var target = {x:0,y:0,rx:0,ry:0,s:1};
    var current = {x:0,y:0,rx:0,ry:0,s:1};

    var rafId = null;

    function onMove(e){
      var rect = frame.getBoundingClientRect();
      var cx = rect.left + rect.width/2;
      var cy = rect.top + rect.height/2;
      var mx = (e.clientX - cx) / (rect.width/2);
      var my = (e.clientY - cy) / (rect.height/2);
      mx = Math.max(-1, Math.min(1, mx));
      my = Math.max(-1, Math.min(1, my));
      target.x = mx * maxTranslate;
      target.y = my * maxTranslate * -1;
      target.ry = mx * (maxRotate);
      target.rx = my * (maxRotate) * -1;
      target.s = hoverScale;
    }

    function onEnter(){ frame.addEventListener('mousemove', onMove); frame.addEventListener('pointermove', onMove); target.s = hoverScale; }
    function onLeave(){ frame.removeEventListener('mousemove', onMove); frame.removeEventListener('pointermove', onMove); target.x=0;target.y=0;target.rx=0;target.ry=0;target.s=1; }

    frame.addEventListener('mouseenter', onEnter); frame.addEventListener('pointerenter', onEnter);
    frame.addEventListener('mouseleave', onLeave); frame.addEventListener('pointerleave', onLeave);

    function lerp(a,b,n){return (1-n)*a + n*b}

    function animate(){
      current.x = lerp(current.x, target.x, 0.12);
      current.y = lerp(current.y, target.y, 0.12);
      current.rx = lerp(current.rx, target.rx, 0.12);
      current.ry = lerp(current.ry, target.ry, 0.12);
      current.s = lerp(current.s, target.s, 0.08);

      var t = 'translate3d(' + current.x.toFixed(2) + 'px,' + current.y.toFixed(2) + 'px,0) ' +
              'rotateX(' + current.rx.toFixed(3) + 'deg) rotateY(' + current.ry.toFixed(3) + 'deg) ' +
              'scale(' + current.s.toFixed(3) + ')';
      card.style.transform = t;

      rafId = requestAnimationFrame(animate);
    }
    animate();
  }

  document.addEventListener('DOMContentLoaded', function(){
    heroEntrance();
    imageEntrance();
    setupObservers();
    setupInertia();
    setupHeroMotion();
    setupHeroProximity();
    setupArchiveCards();
    setupInverseCursor();
    setupManifesto();
    setupAboutPage();
    setupContactTerminal();
    setupBlogPage();
    setupDocInertia();
  });
})();

function setupHeroMotion(){
  var hero = document.querySelector('.home-page .hero');
  var title = hero && hero.querySelector('.hero-title');
  if(!hero || !title) return;

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var words = Array.from(title.querySelectorAll('.hero-word'));
  var sequence = 0;
  var fieldNote = hero.querySelector('.lead[data-field-note]');

  if(fieldNote) setupHeroFieldNotes(fieldNote, hero, prefersReduced);

  words.forEach(function(word, wordIndex){
    var text = word.textContent;
    word.textContent = '';
    Array.from(text).forEach(function(character, charIndex){
      var char = document.createElement('span');
      char.className = 'hero-char';
      char.textContent = character;
      char.style.setProperty('--hero-char-x', ((charIndex % 2 ? 1 : -1) * (2 + charIndex % 3)) + 'px');
      char.style.setProperty('--hero-char-y', ((wordIndex % 2 ? -1 : 1) * (2 + charIndex % 4)) + 'px');
      char.style.setProperty('--hero-char-scale', (0.78 + ((charIndex * 5) % 5) / 18).toFixed(2));
      char.style.setProperty('--hero-char-skew', ((charIndex % 2 ? 1 : -1) * (1 + charIndex % 2)) + 'deg');
      char.style.transitionDelay = (sequence * 34) + 'ms';
      word.appendChild(char);
      sequence += 1;
    });
  });

  function assembleTitle(){
    title.classList.add('hero-assembled');
    if(prefersReduced) return;
    setTimeout(function(){ title.classList.add('hero-glare'); }, sequence * 34 + 220);
    setTimeout(function(){ title.classList.remove('hero-glare'); }, sequence * 34 + 1220);
  }

  if(prefersReduced){
    assembleTitle();
    return;
  }

  if('IntersectionObserver' in window){
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          assembleTitle();
          observer.unobserve(hero);
        }
      });
    }, {threshold:0.15});
    observer.observe(hero);
  }else{
    assembleTitle();
  }

  var titlePointer = function(event){
    var rect = title.getBoundingClientRect();
    var x = Math.max(-1, Math.min(1, (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)));
    title.style.setProperty('--hero-light-x', (50 + x * 28).toFixed(1) + '%');
  };
  title.addEventListener('pointermove', titlePointer, {passive:true});
  title.addEventListener('pointerleave', function(){ title.style.setProperty('--hero-light-x','50%'); });

  var terminalLabels = [
    hero.querySelector('.hero-terminal-label'),
    hero.querySelector('.hero-coordinate'),
    hero.querySelector('.hero-vertical-label')
  ];
  terminalLabels.forEach(function(label, index){
    if(!label) return;
    var values = (label.getAttribute('data-values') || label.textContent).split('|');
    cycleHeroTerminal(label, values, 11000 + index * 1800, hero);
  });

}

function setupHeroProximity(){
  var title = document.querySelector('.home-page .hero-title');
  if(!title || window.matchMedia('(hover: none), (pointer: coarse), (prefers-reduced-motion: reduce)').matches) return;

  var letters = Array.from(title.querySelectorAll('.hero-char'));
  if(!letters.length) return;

  var target = letters.map(function(){ return {scale:1,y:0}; });
  var current = letters.map(function(){ return {scale:1,y:0}; });
  var pointer = {x:0,y:0};
  var active = false;
  var framePending = false;

  function clamp(value){ return Math.max(-1, Math.min(1, value)); }
  function setTargets(){
    if(active){
      letters.forEach(function(letter,index){
        var rect = letter.getBoundingClientRect();
        var centerX = rect.left + rect.width / 2;
        var centerY = rect.top + rect.height / 2;
        var distance = Math.hypot(pointer.x - centerX, pointer.y - centerY);
        var influence = Math.max(0, 1 - distance / 118);
        influence = influence * influence;
        target[index].scale = 1 + influence * .14;
        target[index].y = influence * -3.5;
      });
      title.style.scale = '1.012';
    }else{
      target.forEach(function(value){ value.scale = 1; value.y = 0; });
      title.style.scale = '1';
    }
  }
  function onPointerMove(event){
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    if(!framePending){
      framePending = true;
      requestAnimationFrame(function(){
        framePending = false;
        setTargets();
      });
    }
  }
  function onEnter(event){
    active = true;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    setTargets();
  }
  function onLeave(){
    active = false;
    setTargets();
  }
  function spring(value,destination,stiffness){ return value + (destination - value) * stiffness; }
  function animate(){
    letters.forEach(function(letter,index){
      current[index].scale = spring(current[index].scale,target[index].scale,active ? .2 : .12);
      current[index].y = spring(current[index].y,target[index].y,active ? .2 : .12);
      letter.style.scale = current[index].scale.toFixed(3);
      letter.style.translate = '0 ' + current[index].y.toFixed(2) + 'px';
    });
    requestAnimationFrame(animate);
  }

  title.addEventListener('pointerenter',onEnter);
  title.addEventListener('pointermove',onPointerMove,{passive:true});
  title.addEventListener('pointerleave',onLeave);
  requestAnimationFrame(animate);
}

function pulseHero(hero){
  hero.classList.remove('hero-system-pulse');
  void hero.offsetWidth;
  hero.classList.add('hero-system-pulse');
  setTimeout(function(){ hero.classList.remove('hero-system-pulse'); }, 900);
}

function cycleHeroTerminal(element, values, hold, hero){
  var index = 0;
  function typeNext(){
    index = (index + 1) % values.length;
    var next = values[index];
    var current = element.textContent;
    element.classList.add('hero-label-updating');
    function erase(position){
      if(position <= 0){
        setTimeout(function(){ typeCharacters(0); }, 180);
        return;
      }
      element.textContent = current.slice(0, position - 1);
      setTimeout(function(){ erase(position - 1); }, 30);
    }
    function typeCharacters(position){
      if(position >= next.length){
        element.classList.remove('hero-label-updating');
        setTimeout(typeNext, hold);
        return;
      }
      element.textContent = next.slice(0, position + 1);
      setTimeout(function(){ typeCharacters(position + 1); }, 42);
    }
    pulseHero(hero);
    erase(current.length);
  }
  setTimeout(typeNext, hold);
}

function setupHeroFieldNotes(element, hero, prefersReduced){
  var notes = [
    'Pioneer turns odd sketches, stubborn materials, and too much curiosity into working machines.',
    'We build strange ideas long enough to find out whether they can become useful.',
    'Every prototype starts somewhere between a bad idea, a good question, and the decision to actually build it.',
    'We experiment with machines, materials, environments, and systems that are not quite ready for the real world yet.',
    'Some inventions begin as sketches. Others begin as problems that refuse to leave us alone.',
    'Pioneer is a growing archive of experiments that move from imagination into something you can actually touch.',
    'We are interested in what happens when curiosity stops being theoretical and starts taking physical form.'
  ];
  var row = element.parentElement;
  var indexLabel = row.querySelector('.field-index');
  var currentIndex = 0;
  var busy = false;
  var holdTimer = null;
  var pauseBeforeType = 180;
  var characterDelay = 28;
  var holdDuration = 8500;

  function setIndex(nextIndex){
    currentIndex = nextIndex;
    if(indexLabel) indexLabel.textContent = String(nextIndex + 1).padStart(2,'0') + ' / 07';
    element.setAttribute('aria-label','Rotate Pioneer field note ' + (nextIndex + 1) + ' of 7');
  }
  function finish(){
    busy = false;
    element.setAttribute('aria-busy','false');
    row.classList.remove('hero-field-update');
    holdTimer = setTimeout(function(){ transitionTo((currentIndex + 1) % notes.length); }, holdDuration);
  }
  function transitionTo(nextIndex){
    if(busy) return;
    if(holdTimer){ clearTimeout(holdTimer); holdTimer = null; }
    if(prefersReduced){
      setIndex(nextIndex);
      element.textContent = notes[nextIndex];
      return;
    }
    busy = true;
    element.setAttribute('aria-busy','true');
    row.classList.add('hero-field-update');
    pulseHero(hero);
    function erase(){
      if(element.textContent.length === 0){
        setTimeout(type, pauseBeforeType);
        return;
      }
      element.textContent = element.textContent.slice(0,-1);
      setTimeout(erase, characterDelay);
    }
    function type(){
      var next = notes[nextIndex];
      setIndex(nextIndex);
      var position = 0;
      function addCharacter(){
        if(position >= next.length){
          element.textContent = next;
          finish();
          return;
        }
        element.textContent = next.slice(0,position + 1);
        position += 1;
        setTimeout(addCharacter, characterDelay);
      }
      addCharacter();
    }
    erase();
  }
  function requestNext(){
    if(busy) return;
    transitionTo((currentIndex + 1) % notes.length);
  }

  element.addEventListener('click',requestNext);
  element.addEventListener('keydown',function(event){
    if(event.key === 'Enter' || event.key === ' '){
      event.preventDefault();
      requestNext();
    }
  });
  element.setAttribute('aria-busy','false');
  if(!prefersReduced) holdTimer = setTimeout(function(){ transitionTo(1); }, holdDuration);
}

function setupArchiveCards(){
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cards = Array.from(document.querySelectorAll('.home-page .project-card'));
  if(prefersReduced || !cards.length || !window.matchMedia('(hover: hover)').matches) return;

  cards.forEach(function(card){
    var target = {x:0,y:0,rx:0,ry:0};
    var current = {x:0,y:0,rx:0,ry:0};
    var active = false;
    var rect = null;

    function clamp(value){ return Math.max(-1, Math.min(1, value)); }
    function onMove(event){
      if(event.pointerType && event.pointerType !== 'mouse') return;
      rect = rect || card.getBoundingClientRect();
      var mx = clamp((event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2));
      var my = clamp((event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2));
      target.x = mx * 3.5;
      target.y = my * -2.5;
      target.ry = mx * 1.8;
      target.rx = my * -1.5;
      card.style.setProperty('--light-x', (50 + mx * 24).toFixed(1) + '%');
      card.style.setProperty('--light-y', (45 + my * 16).toFixed(1) + '%');
      card.style.setProperty('--grid-x', (mx * 4).toFixed(2) + 'px');
      card.style.setProperty('--grid-y', (my * 3).toFixed(2) + 'px');
      card.style.setProperty('--label-x', (mx * 1.5).toFixed(2) + 'px');
      card.style.setProperty('--label-y', (my * 1.5).toFixed(2) + 'px');
      card.style.setProperty('--number-x', (mx * -3).toFixed(2) + 'px');
      card.style.setProperty('--number-y', (my * -2).toFixed(2) + 'px');
      card.style.setProperty('--type-x', (mx * .7).toFixed(2) + 'px');
      card.style.setProperty('--type-y', (my * .7).toFixed(2) + 'px');
    }
    function onEnter(event){
      if(event.pointerType && event.pointerType !== 'mouse') return;
      active = true;
      rect = card.getBoundingClientRect();
    }
    function onLeave(){
      active = false;
      rect = null;
      target.x = 0; target.y = 0; target.rx = 0; target.ry = 0;
      card.style.setProperty('--light-x','50%');
      card.style.setProperty('--light-y','45%');
      card.style.setProperty('--grid-x','0px');
      card.style.setProperty('--grid-y','0px');
      card.style.setProperty('--label-x','0px');
      card.style.setProperty('--label-y','0px');
      card.style.setProperty('--number-x','0px');
      card.style.setProperty('--number-y','0px');
      card.style.setProperty('--type-x','0px');
      card.style.setProperty('--type-y','0px');
    }
    function spring(value, destination, stiffness){ return value + (destination - value) * stiffness; }
    function animate(){
      current.x = spring(current.x, target.x, active ? .16 : .1);
      current.y = spring(current.y, target.y, active ? .16 : .1);
      current.rx = spring(current.rx, target.rx, active ? .14 : .09);
      current.ry = spring(current.ry, target.ry, active ? .14 : .09);
      card.style.transform = 'translate3d(' + current.x.toFixed(2) + 'px,' + current.y.toFixed(2) + 'px,0) rotateX(' + current.rx.toFixed(2) + 'deg) rotateY(' + current.ry.toFixed(2) + 'deg)';
      requestAnimationFrame(animate);
    }

    card.addEventListener('pointerenter', onEnter);
    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerleave', onLeave);
    requestAnimationFrame(animate);
  });
}

function setupInverseCursor(){
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var supportsHover = window.matchMedia('(hover: hover)').matches;
  if(prefersReduced || !supportsHover) return;

  var cursor = document.createElement('span');
  cursor.className = 'inverse-cursor';
  cursor.setAttribute('aria-hidden','true');
  document.body.appendChild(cursor);

  var target = {x:-40,y:-40};
  var current = {x:-40,y:-40};
  var active = false;

  function onMove(event){
    target.x = event.clientX;
    target.y = event.clientY;
    active = true;
    cursor.classList.add('is-visible');
  }
  function onLeave(){
    active = false;
    cursor.classList.remove('is-visible');
  }
  function spring(value,destination){ return value + (destination - value) * (active ? .2 : .12); }
  function animate(){
    current.x = spring(current.x,target.x);
    current.y = spring(current.y,target.y);
    cursor.style.transform = 'translate3d(' + current.x.toFixed(2) + 'px,' + current.y.toFixed(2) + 'px,0) translate3d(-50%,-50%,0)';
    requestAnimationFrame(animate);
  }

  document.addEventListener('pointermove',onMove,{passive:true});
  document.documentElement.addEventListener('pointerleave',onLeave,{passive:true});
  requestAnimationFrame(animate);
}

function setupManifesto(){
  var section = document.querySelector('.home-page .manifesto');
  if(!section) return;

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var words = Array.from(section.querySelectorAll('.quote-word'));
  var sequence = 0;

  words.forEach(function(word, wordIndex){
    var text = word.getAttribute('data-word') || word.textContent;
    word.textContent = '';
    Array.from(text).forEach(function(character, charIndex){
      var char = document.createElement('span');
      char.className = 'quote-char';
      char.textContent = character;
      char.style.setProperty('--char-x', ((charIndex % 2 ? 1 : -1) * (2 + (charIndex % 3))) + 'px');
      char.style.setProperty('--char-y', ((wordIndex % 2 ? -1 : 1) * (3 + (charIndex % 4))) + 'px');
      char.style.setProperty('--char-scale', (0.72 + ((charIndex * 7) % 5) / 20).toFixed(2));
      char.style.setProperty('--char-rotate', ((charIndex % 2 ? 1 : -1) * (1 + charIndex % 3)) + 'deg');
      char.style.transitionDelay = (sequence * 26) + 'ms';
      word.appendChild(char);
      sequence += 1;
    });
  });

  function build(){
    if(section.classList.contains('is-built')) return;
    section.classList.add('is-live');
    setTimeout(function(){ section.classList.add('is-built'); }, prefersReduced ? 0 : 120);
  }

  if(prefersReduced){
    build();
    return;
  }

  setupManifestoMagnetics(section);

  if('IntersectionObserver' in window){
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          build();
          observer.unobserve(section);
        }
      });
    }, {threshold:0.28, rootMargin:'0px 0px -8% 0px'});
    observer.observe(section);
  }else{
    build();
  }
}

function setupManifestoMagnetics(section){
  if(!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  var selector = '.manifesto-topline > span, .manifesto-side > span, .manifesto-rule > span, .manifesto-measure > span, .manifesto-calibration > span, .manifesto-footer > span, .manifesto-process > span, .manifesto-process > strong';
  var labels = Array.from(section.querySelectorAll(selector));

  labels.forEach(function(label){
    label.classList.add('manifesto-magnetic');
    var target = {x:0,y:0,r:0,s:1};
    var current = {x:0,y:0,r:0,s:1};
    var active = false;
    var rect = null;

    function clamp(value){ return Math.max(-1, Math.min(1, value)); }
    function onEnter(){
      active = true;
      rect = label.getBoundingClientRect();
    }
    function onMove(event){
      rect = rect || label.getBoundingClientRect();
      var mx = clamp((event.clientX - (rect.left + rect.width / 2)) / Math.max(rect.width, 1));
      var my = clamp((event.clientY - (rect.top + rect.height / 2)) / Math.max(rect.height, 1));
      target.x = mx * 5;
      target.y = my * 3;
      target.r = mx * 2.2;
      target.s = 1.3;
    }
    function onLeave(){
      active = false;
      rect = null;
      target.x = 0;
      target.y = 0;
      target.r = 0;
      target.s = 1;
    }
    function spring(value,destination,stiffness){ return value + (destination - value) * stiffness; }
    function animate(){
      current.x = spring(current.x,target.x,active ? .18 : .1);
      current.y = spring(current.y,target.y,active ? .18 : .1);
      current.r = spring(current.r,target.r,active ? .16 : .09);
      current.s = spring(current.s,target.s,active ? .15 : .08);
      label.style.translate = current.x.toFixed(2) + 'px ' + current.y.toFixed(2) + 'px';
      label.style.rotate = current.r.toFixed(2) + 'deg';
      label.style.scale = current.s.toFixed(3);
      requestAnimationFrame(animate);
    }

    label.addEventListener('pointerenter',onEnter);
    label.addEventListener('pointermove',onMove,{passive:true});
    label.addEventListener('pointerleave',onLeave);
    requestAnimationFrame(animate);
  });
}

function setupBlogPage(){
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.querySelector('.blog-page');
  if(!root) return;
  if(prefersReduced){
    var doc = document.querySelector('.doc-paper'); if(doc) doc.style.opacity = 1;
    return;
  }
  setTimeout(function(){
    root.classList.add('doc-ready');
    var title = document.querySelector('.doc-title'); if(title) title.classList.add('glitch');
    setTimeout(function(){ if(title) title.classList.remove('glitch'); }, 520);
  }, 260);
}

function setupDocInertia(){
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var paper = document.querySelector('.doc-paper');
  if(!paper) return;
  if(prefersReduced) return;

  var maxRX = 6;
  var maxRY = 8;
  var maxT = 18;
  var target = {rx:0,ry:0,x:0,y:0};
  var current = {rx:0,ry:0,x:0,y:0};
  var windowW = window.innerWidth;

  function onMove(e){
    if(window.innerWidth < 680) return;
    var rect = paper.getBoundingClientRect();
    var cx = rect.left + rect.width/2;
    var cy = rect.top + rect.height/2;
    var mx = (e.clientX - cx) / (rect.width/2);
    var my = (e.clientY - cy) / (rect.height/2);
    mx = Math.max(-1, Math.min(1, mx));
    my = Math.max(-1, Math.min(1, my));
    target.ry = mx * maxRY;
    target.rx = my * maxRX * -1;
    target.x = mx * maxT * -0.4;
    target.y = my * maxT * -0.2;
  }

  window.addEventListener('mousemove', onMove);

  function lerp(a,b,n){return (1-n)*a + n*b}

  var parallaxEls = Array.from(paper.querySelectorAll('img'));

  function animate(){
    current.rx = lerp(current.rx, target.rx, 0.08);
    current.ry = lerp(current.ry, target.ry, 0.08);
    current.x = lerp(current.x, target.x, 0.09);
    current.y = lerp(current.y, target.y, 0.09);

    var t = 'translate3d(' + current.x.toFixed(2) + 'px,' + current.y.toFixed(2) + 'px,0) rotateX(' + current.rx.toFixed(3) + 'deg) rotateY(' + current.ry.toFixed(3) + 'deg)';
    paper.style.transform = t;

    parallaxEls.forEach(function(img){
      var px = (current.x * -0.25).toFixed(2);
      var py = (current.y * -0.25).toFixed(2);
      img.style.transform = 'translate3d(' + px + 'px,' + py + 'px,0)';
    });

    requestAnimationFrame(animate);
  }

  target.y = -6;
  setTimeout(function(){ target.y = 0; }, 420);
  requestAnimationFrame(animate);

  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, {threshold:0.08, rootMargin:'0px 0px -8% 0px'});
    document.querySelectorAll('.doc-section').forEach(function(s){ io.observe(s); });
  }else{
    document.querySelectorAll('.doc-section').forEach(function(s){ s.classList.add('in'); });
  }
}

/* About page system interactions */
function setupAboutPage(){
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var aboutRoot = document.querySelector('.about-page');
  if(!aboutRoot) return;

  var title = aboutRoot.querySelector('.about-title');
  var modules = Array.from(aboutRoot.querySelectorAll('.about-module'));
  var blueprint = aboutRoot.querySelector('.blueprint');
  var scrambleTargets = Array.from(aboutRoot.querySelectorAll('.module-name,.module-status,.about-boot-label span,.purpose-line b'));

  setupAboutControls(aboutRoot, prefersReduced);
  setupPurposeTypeMagnetics(aboutRoot, prefersReduced);

  function boot(){
    if(title) title.classList.add('about-assembled');
    aboutRoot.classList.add('hero-ready');
  }
  if(prefersReduced){
    boot();
    modules.forEach(function(module){ module.classList.add('module-active'); });
    return;
  }

  setTimeout(boot,180);

  if('IntersectionObserver' in window){
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('module-active');
          scrambleLabel(entry.target.querySelector('.module-name'));
          observer.unobserve(entry.target);
        }
      });
    }, {threshold:.24,rootMargin:'0px 0px -8% 0px'});
    modules.forEach(function(module){ observer.observe(module); });
  }else{
    modules.forEach(function(module){ module.classList.add('module-active'); });
  }

  scrambleTargets.forEach(function(target){
    target.addEventListener('pointerenter',function(){ scrambleLabel(target); });
  });

  if(blueprint && window.matchMedia('(hover:hover) and (pointer:fine)').matches){
    var point = {x:0,y:0};
    var ring = blueprint.querySelector('.ring-one');
    blueprint.addEventListener('pointermove',function(event){
      var rect = blueprint.getBoundingClientRect();
      point.x = ((event.clientX - rect.left) / rect.width - .5) * 10;
      point.y = ((event.clientY - rect.top) / rect.height - .5) * 10;
      blueprint.style.setProperty('--blueprint-x',point.x.toFixed(2)+'px');
      blueprint.style.setProperty('--blueprint-y',point.y.toFixed(2)+'px');
    },{passive:true});
    blueprint.addEventListener('pointerleave',function(){ blueprint.style.setProperty('--blueprint-x','0px'); blueprint.style.setProperty('--blueprint-y','0px'); });
    if(ring) ring.style.transformOrigin='50% 50%';
  }

  var lastScroll = 0;
  function onScroll(){
    var scrollY = window.scrollY || window.pageYOffset;
    if(Math.abs(scrollY - lastScroll) < 3) return;
    lastScroll = scrollY;
    var purpose = aboutRoot.querySelector('.about-purpose');
    if(purpose){
      var rect = purpose.getBoundingClientRect();
      var progress = Math.max(0,Math.min(1,(window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
      purpose.style.setProperty('--purpose-shift',(progress * 28 - 14).toFixed(2)+'px');
    }
  }
  window.addEventListener('scroll',onScroll,{passive:true});
  onScroll();

  function scrambleLabel(target){
    if(!target || target.dataset.scrambling === 'true') return;
    var original = target.textContent;
    target.dataset.scrambling='true';
    var glyphs='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/—';
    var frame=0;
    var timer=setInterval(function(){
      frame += 1;
      target.textContent = original.split('').map(function(character,index){
        if(character===' ') return ' ';
        return frame > 4 + index % 3 ? character : glyphs[(frame + index * 7) % glyphs.length];
      }).join('');
      if(frame > 9){ clearInterval(timer); target.textContent=original; target.dataset.scrambling='false'; }
    },28);
  }
}

function setupAboutControls(root, prefersReduced){
  var readoutNumber = root.querySelector('.identity-readout strong');
  if(readoutNumber) readoutNumber.textContent = '01\u2014\u221e';
  var identityReadout = root.querySelector('.identity-readout');
  if(identityReadout && !identityReadout.querySelector('.identity-output')){
    var output = document.createElement('span');
    output.className = 'identity-output';
    output.innerHTML = 'OUTPUT: <b>UNKNOWN</b>';
    identityReadout.appendChild(output);
  }
  var measure = root.querySelector('.identity-measure');
  if(measure && !measure.querySelector('.system-slider')){
    var original = measure.querySelector('b');
    if(original){
      var slider = document.createElement('div');
      slider.className = 'system-slider'; slider.tabIndex = 0; slider.setAttribute('role','slider');
      slider.setAttribute('aria-label','Imagination to implementation transition');
      slider.innerHTML = '<div class="slider-fill"></div><button class="slider-handle" type="button" aria-label="Transition point"><span class="slider-value">53%</span><small>TRANSITION</small></button>';
      original.replaceWith(slider);
    }
  }
  var slider = root.querySelector('.system-slider');
  if(slider){
    var value = 53, handle = slider.querySelector('.slider-handle'), valueLabel = slider.querySelector('.slider-value');
    function setValue(next){
      value = Math.max(0,Math.min(100,Math.round(next)));
      slider.style.setProperty('--value',value + '%');
      slider.setAttribute('aria-valuenow',value); slider.setAttribute('aria-valuetext',value + '% transition');
      if(valueLabel) valueLabel.textContent = value + '%';
    }
    function fromEvent(event){ var rect=slider.getBoundingClientRect(); setValue((event.clientX-rect.left)/rect.width*100); }
    slider.addEventListener('pointerdown',function(event){ event.preventDefault(); slider.classList.add('is-dragging'); slider.setPointerCapture(event.pointerId); fromEvent(event); });
    slider.addEventListener('pointermove',function(event){ if(slider.classList.contains('is-dragging')) fromEvent(event); });
    slider.addEventListener('pointerup',function(){ slider.classList.remove('is-dragging'); });
    slider.addEventListener('keydown',function(event){ var n = event.shiftKey ? 10 : 2; if(event.key==='ArrowRight'||event.key==='ArrowUp'){event.preventDefault();setValue(value+n)} if(event.key==='ArrowLeft'||event.key==='ArrowDown'){event.preventDefault();setValue(value-n)} if(event.key==='Home'){setValue(0)} if(event.key==='End'){setValue(100)} });
    setValue(value);
  }

  var copies = Array.from(root.querySelectorAll('.identity-copy p'));
  if(!prefersReduced) copies.forEach(function(copy,index){
    var text=copy.textContent, glyphs='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    copy.dataset.text=text; copy.textContent=text.split('').map(function(char,i){ return i%8===0 && char!==' ' ? glyphs[(i+index*3)%glyphs.length] : char; }).join('');
    setTimeout(function(){
      copy.classList.add('is-decoding'); var frame=0;
      var timer=setInterval(function(){ frame++; copy.textContent=text.split('').map(function(char,i){ return char===' '||frame>5+(i%7) ? char : glyphs[(i*5+frame)%glyphs.length]; }).join(''); if(frame>12){clearInterval(timer);copy.textContent=text;copy.classList.remove('is-decoding');} },35);
    },500+index*520);
    copy.addEventListener('pointerenter',function(){ copy.classList.add('is-decoding'); setTimeout(function(){copy.classList.remove('is-decoding')},850); });
  });

  var blueprint=root.querySelector('.blueprint');
  if(blueprint){
    var extra=['ring-three','ring-arc'];
    extra.forEach(function(name){ if(!blueprint.querySelector('.'+name)){var el=document.createElement('div');el.className='blueprint-ring '+name;blueprint.appendChild(el);} });
    ['orbit-one','orbit-two'].forEach(function(name){ if(!blueprint.querySelector('.'+name)){var orbit=document.createElement('div');orbit.className='blueprint-orbit '+name;orbit.innerHTML='<i></i>';blueprint.appendChild(orbit);} });
    if(!blueprint.querySelector('.blueprint-core-pulse')){var pulse=document.createElement('div');pulse.className='blueprint-core-pulse';blueprint.appendChild(pulse);}
    [['label-d','VECTOR 184\u00b0'],['label-e','SIGNAL / STABLE']].forEach(function(item){if(!blueprint.querySelector('.'+item[0])){var label=document.createElement('span');label.className='blueprint-label '+item[0];label.textContent=item[1];blueprint.appendChild(label);}});
    if(!blueprint.querySelector('.line-c')){var line=document.createElement('span');line.className='blueprint-line line-c';blueprint.appendChild(line);}
    if(!blueprint.querySelector('.node-c')){var node=document.createElement('button');node.type='button';node.className='blueprint-node node-c';node.setAttribute('aria-label','Node 03');blueprint.appendChild(node);}
    blueprint.querySelectorAll('.blueprint-node').forEach(function(node){ node.addEventListener('click',function(){ blueprint.classList.add('system-event'); setTimeout(function(){blueprint.classList.remove('system-event')},700); }); });
    if(!prefersReduced && window.matchMedia('(hover:hover) and (pointer:fine)').matches){ blueprint.addEventListener('pointermove',function(event){var r=blueprint.getBoundingClientRect(),x=(event.clientX-r.left)/r.width-.5,y=(event.clientY-r.top)/r.height-.5; blueprint.querySelectorAll('.blueprint-label').forEach(function(label,i){label.style.transform='translate('+(x*(i+1)*3).toFixed(1)+'px,'+(y*(i+1)*3).toFixed(1)+'px)'});},{passive:true}); }
  }
}

function setupPurposeTypeMagnetics(root, prefersReduced){
  var heading = root.querySelector('.about-purpose .purpose-main h2');
  if(!heading || prefersReduced || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;

  var characters = [];
  function wrapText(node){
    Array.from(node.childNodes).forEach(function(child){
      if(child.nodeType === Node.TEXT_NODE){
        var fragment = document.createDocumentFragment();
        Array.from(child.textContent).forEach(function(character){
          var letter = document.createElement('span');
          letter.className = 'purpose-char';
          letter.textContent = character === ' ' ? '\u00a0' : character;
          fragment.appendChild(letter);
          characters.push(letter);
        });
        child.replaceWith(fragment);
      }else if(child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR'){
        wrapText(child);
      }
    });
  }
  wrapText(heading);

  var raf = 0;
  var pointer = null;
  function render(){
    raf = 0;
    if(!pointer) return;
    characters.forEach(function(letter){
      var rect = letter.getBoundingClientRect();
      var x = rect.left + rect.width / 2;
      var y = rect.top + rect.height * .58;
      var distance = Math.hypot(pointer.x - x, pointer.y - y);
      var influence = Math.max(0, 1 - distance / 108);
      var scale = 1 + Math.pow(influence, 1.85) * .26;
      var lift = Math.pow(influence, 2) * -1.5;
      letter.style.setProperty('--purpose-scale', scale.toFixed(3));
      letter.style.setProperty('--purpose-lift', lift.toFixed(2) + 'px');
    });
  }
  function queue(event){
    pointer = {x:event.clientX,y:event.clientY};
    if(!raf) raf = requestAnimationFrame(render);
  }
  function reset(){
    pointer = null;
    if(raf){ cancelAnimationFrame(raf); raf = 0; }
    characters.forEach(function(letter){
      letter.style.setProperty('--purpose-scale','1');
      letter.style.setProperty('--purpose-lift','0px');
    });
  }
  heading.addEventListener('pointermove',queue,{passive:true});
  heading.addEventListener('pointerleave',reset);
}

function setupContactTerminal(){
  var terminal = document.querySelector('.contact-terminal');
  if(!terminal) return;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var title = terminal.querySelector('.contact-title');
  var count = terminal.querySelector('#payload-count');
  var message = terminal.querySelector('#contact-message');
  var state = terminal.querySelector('.console-state');

  var railTitle = terminal.querySelector('#transmission-heading');
  if(railTitle) railTitle.textContent = 'CONTACT / COMPOSE MESSAGE';
  var terminalMark = terminal.querySelector('.console-aside strong');
  if(terminalMark) terminalMark.textContent = 'CONTACT';
  var payloadLabel = terminal.querySelector('.payload-field label b');
  if(payloadLabel) payloadLabel.textContent = 'CONTACT MESSAGE';
  var payloadMeta = terminal.querySelector('.payload-field label small');
  if(payloadMeta) payloadMeta.innerHTML = '<output id="payload-count">000</output> CHARACTERS / CONTACT READY';
  var submitState = terminal.querySelector('.form-submit > span');
  if(submitState) submitState.innerHTML = '<i></i> CONTACT STATUS / STANDBY';
  var submitButton = terminal.querySelector('.form-submit button');
  if(submitButton) submitButton.innerHTML = 'SEND MESSAGE <b>&rarr;</b>';
  var social = terminal.querySelector('.channel-links');
  if(social) social.innerHTML = '<span class="channel-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.37-3.88-1.37-.53-1.36-1.3-1.72-1.3-1.72-1.06-.72.08-.7.08-.7 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.72 1.27 3.39.97.11-.76.41-1.27.74-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.2-3.09-.12-.29-.52-1.46.11-3.05 0 0 .98-.31 3.2 1.18a11.15 11.15 0 0 1 2.92-.39c.99 0 1.98.13 2.92.39 2.22-1.49 3.2-1.18 3.2-1.18.63 1.59.23 2.76.11 3.05.75.8 1.2 1.83 1.2 3.09 0 4.43-2.7 5.41-5.28 5.69.42.36.8 1.08.8 2.18 0 1.58-.01 2.86-.01 3.25 0 .31.21.68.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/></svg></span><span class="channel-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M2 5h7v3H2V5zm0 5h7v3H2v-3zm0 5h7v3H2v-3zm9-10h11v3H11V5zm0 5h7v3h-7v-3zm0 5h11v3H11v-3z"/></svg></span><span class="channel-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h14l2-2V6a2 2 0 00-2-2zm-10.5 10.5s.8-.95 1.8-.95 1.8.95 1.8.95-.08 1-1.8 1-1.8-1-1.8-1zm5-3.5c.6 0 1 .5 1 1 0 .6-.4 1-1 1s-1-.5-1-1c0-.6.5-1 1-1zM9.5 11c.6 0 1 .5 1 1 0 .6-.4 1-1 1s-1-.5-1-1c0-.6.4-1 1-1z"/></svg></span><span class="channel-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg></span>';

  count = terminal.querySelector('#payload-count');
  if(message && count){
    function updateCount(){ count.textContent = String(message.value.length).padStart(3,'0'); }
    message.addEventListener('input',updateCount); updateCount();
  }
  terminal.querySelectorAll('.form-field input, .form-field textarea').forEach(function(field){
    field.addEventListener('focus',function(){ if(state) state.innerHTML='<i></i> CHANNEL ACTIVE'; });
    field.addEventListener('blur',function(){ if(state) state.innerHTML='<i></i> READY FOR INPUT'; });
  });
  if(!title || reduced) return;
  var letters=[];
  function wrap(node){
    Array.from(node.childNodes).forEach(function(child){
      if(child.nodeType===Node.TEXT_NODE){
        var fragment=document.createDocumentFragment();
        Array.from(child.textContent).forEach(function(character,index){
          var span=document.createElement('span'); span.className='contact-title-char'; span.textContent=character===' ' ? '\u00a0' : character; span.style.transitionDelay=((letters.length*32)+80)+'ms'; fragment.appendChild(span); letters.push(span);
        });
        child.replaceWith(fragment);
      }else if(child.nodeType===Node.ELEMENT_NODE && child.tagName!=='BR'){wrap(child);}
    });
  }
  wrap(title);
  requestAnimationFrame(function(){ terminal.classList.add('contact-ready'); });
}
