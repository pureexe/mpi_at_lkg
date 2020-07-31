var subwin=null;
var enable_pc = false;
window.onbeforeunload = function(){
    if(subwin)subwin.close();
    return;
}
function enableLKG(){
    document.getElementById('btn-enable-pc').disabled = false;
    document.getElementById('btn-enable-lkg').disabled  = true;
    enable_pc = false;
}
function enablePC(){
    document.getElementById('btn-enable-pc').disabled = true;
    document.getElementById('btn-enable-lkg').disabled  = false;
    enable_pc = true;
}
function winOpen()
{
  subwin = window.open("viewer.html","subwin","width=640,height=480,left=20,top=20");
}

function urlChange(url)
{
  if(!subwin || subwin.closed) winOpen();
  if(enable_pc) url += '&pc'
  subwin.location.href=url;
  subwin.focus();
}

function winClose()
{
  if(subwin) subwin.close();
}

//fetch scene
fetch('data/scenes.json').then(response => response.json()).then(function(data){
    scene_select = document.getElementById('scene-select');
    data['scenes'].forEach(function(scene){
        scene_select.insertAdjacentHTML('beforeend', '<button type="button" class="btn btn-secondary btn-lg btn-block" onclick="urlChange(\'viewer.html?scene=data/'+scene+'\');">'+scene+'</button>');
    });
    if(data['scenes'].length > 0){
        document.getElementById('no-scene').style.display = 'none';
    }
})