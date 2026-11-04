$(function() {

  /* ── Cursor ── */
  $(document).on('mousemove', function(e) {
    $('#cur').css({left:e.clientX, top:e.clientY});
    setTimeout(()=>$('#cur-r').css({left:e.clientX,top:e.clientY}), 70);
  });
  $('a,button,.snav-item,.proj-row,.blog-card,.serv-cell,.proc-step,.testi-dot,.soc-link,.b-soc,.btn-gold,.btn-ghost').on('mouseenter',function(){
    $('body').addClass('cur-grow');
  }).on('mouseleave',function(){
    $('body').removeClass('cur-grow');
  });

  /* ── Clock ── */
  function tick() {
    const d = new Date();
    const t = [d.getHours(),d.getMinutes(),d.getSeconds()].map(n=>String(n).padStart(2,'0')).join(':');
    $('#clock').text(t);
  }
  tick(); setInterval(tick, 1000);

  /* ── Navigation ── */
  let cur = 0, total = 9, busy = false;

  window.goTo = function(idx) {
    if (busy || idx===cur || idx<0 || idx>=total) return;
    busy = true;
    const dir = idx > cur ? 1 : -1;
    const $old = $('#s'+cur);
    const $new = $('#s'+idx);

    gsap.to($old.find('.sec-inner'), {
      y: dir*-55, opacity:0, duration:.38, ease:'power2.in',
      onComplete:()=>{
        $old.removeClass('active');
        gsap.set($old.find('.sec-inner'),{y:0,opacity:1});
      }
    });

    $new.addClass('active');
    gsap.fromTo($new.find('.sec-inner'),
      {y:dir*65,opacity:0},
      {y:0,opacity:1,duration:.6,ease:'power3.out',delay:.2,
       onComplete:()=>{ busy=false; onActive(idx); }}
    );

    $('.snav-item').removeClass('active');
    $('[data-s="'+idx+'"]').addClass('active');
    $('#cur-num').text(String(idx+1).padStart(2,'0'));
    cur = idx;
  };

  function onActive(idx) {
    if (idx === 6) { // stats
      $('.sk-fill').each(function(){ $(this).css('width',$(this).data('w')+'%'); });
      $('.counter').each(function(){
        const $el=$(this); const sup=$el.find('.stat-sup');
        const target=parseInt($el.data('t'));
        $({n:0}).animate({n:target},{
          duration:1500,easing:'swing',
          step:function(){ $el.html((sup.length?'<span class="stat-sup">+</span>':'')+(Math.floor(this.n)||'')); },
          complete:function(){ $el.html((sup.length?'<span class="stat-sup">+</span>':'')+target); }
        });
      });
    }
  }

  /* nav dots */
  $('.snav-item').on('click',function(){ goTo(parseInt($(this).data('s'))); });

  /* wheel */
  let wt=0;
  $(window).on('wheel',function(e){
    const now=Date.now(); if(now-wt<850)return; wt=now;
    if(e.originalEvent.deltaY>0) goTo(cur+1); else goTo(cur-1);
  });
  /* touch */
  let ty=0;
  $(document).on('touchstart',e=>ty=e.originalEvent.touches[0].clientY);
  $(document).on('touchend',function(e){
    const d=ty-e.originalEvent.changedTouches[0].clientY;
    if(Math.abs(d)>40){ d>0?goTo(cur+1):goTo(cur-1); }
  });
  /* keyboard */
  $(document).on('keydown',function(e){
    if(e.key==='ArrowDown'||e.key==='PageDown') goTo(cur+1);
    if(e.key==='ArrowUp'||e.key==='PageUp') goTo(cur-1);
    const n=parseInt(e.key); if(n>=1&&n<=total) goTo(n-1);
  });

  /* ── Testimonial rotator ── */
  let ti=0;
  function rotateTesti() {
    $('.testi-card').removeClass('active');
    $('.testi-dot').removeClass('active');
    ti=(ti+1)%3;
    $('.testi-card').eq(ti).addClass('active');
    $('.testi-dot').eq(ti).addClass('active');
  }
  let testiTimer=setInterval(rotateTesti,4000);
  $('.testi-dot').on('click',function(){
    clearInterval(testiTimer);
    ti=parseInt($(this).data('t'))-1;
    rotateTesti();
    testiTimer=setInterval(rotateTesti,4000);
  });

  /* ── Entrance ── */
  gsap.from('#s0 .sec-inner',{y:60,opacity:0,duration:1.3,ease:'power3.out',delay:.2});
  gsap.from('#topbar',{y:-40,opacity:0,duration:.9,ease:'power3.out',delay:.5});
  gsap.from('#side-nav',{x:-40,opacity:0,duration:.9,ease:'power3.out',delay:.7});
  gsap.from('#bottombar',{y:40,opacity:0,duration:.9,ease:'power3.out',delay:.6});

  /* ── Mouse parallax on blobs ── */
  $(document).on('mousemove',function(e){
    const rx=e.clientX/window.innerWidth-.5, ry=e.clientY/window.innerHeight-.5;
    gsap.to('.mb1',{x:rx*50,y:ry*50,duration:2.5,ease:'power1.out'});
    gsap.to('.mb2',{x:rx*-35,y:ry*-35,duration:2.5,ease:'power1.out'});
    gsap.to('.mb3',{x:rx*25,y:ry*20,duration:2.5,ease:'power1.out'});
  });

});