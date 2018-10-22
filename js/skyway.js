// strictモードでは、より的確なエラーチェックが行われるため、
// これまでエラーにならなかったような曖昧な実装がエラー扱いになります
'use strict';


// ref. https://webrtc.ecl.ntt.com/js-tutorial.html
let localStream = null;
let peer = null;
let existingCall = null;


// https://qiita.com/Futo23/items/bff1ce1d2e1b219b243d
// About navigator method
// https://developer.mozilla.org/ja/docs/Web/API/Window/navigator
// Promise とは
// https://techracho.bpsinc.jp/hachi8833/2017_11_16/48168
navigator.mediaDevices.getUserMedia({video: true, audio: true})
    .then(function(stream){
        // Suuccess
        $('#my-video').get(0).srcObject = stream;
        localStream = stream;
    }).catch(function(error){
        // Error
        console.error('mediaDevice.getUserMedia() error:', error);
        return;
    });

peer = new Peer({
    key: '378e12ed-0e66-4ed2-b1d0-31d3f73b8b71',
    debug: 3
});


// Connection Success
peer.on('open', function(){
    $('#my-id').text(peer.id);
});

// Connection Failure
peer.on('error', function(err){
    alert(err.message);
});

// Disconnection 
peer.on('close', function(){
});


// Stream とは
// データを送受信する際にデータ全体の受信完了を待たずに
// 受信したデータから順番に処理を行う送受信方式(ストリーミング)や
// そのように扱うデータ列のことをストリームという。

$('#make-call').submit(function(e){
    e.preventDefault();
    const call = peer.call($('#callto-id').val(), localStream);
    setupCallEventHandlers(call);
});

$('#end-call').click(function(){
    existingCall.close();
});

// 着信処理 setuoCallEventHandlersを実行し、
// Callオブジェクトのイベントリスナーをセットする
peer.on('call', function(call){
    call.answer(localStream);
    setupCallEventHandlers(call);
});

// Callオブジェクトに必要なイベントリスナー
// イベントハンドラ と イベントリスナー の違い
// https://teratail.com/questions/4024
// ・clickイベントに対して紐付けられる処理→イベントハンドラ
// ・clickイベントにイベントハンドラを紐付ける仕組み→イベントリスナー

 // 今回作るアプリでは既に接続中の場合は一旦既存の接続を切断し、後からきた接続要求を優先します。 
function setupCallEventHandlers(call){
    if (existingCall) {
        existingCall.close();
    };

    existingCall = call;

    // 相手のカメラ映像・マイク音声を受信した際に発火する
    // 取得したStramオブジェクトをvideo要素にセット
    call.on('stream', function(stream){
        addVideo(call,stream);
        setupEndCallUI();
        $('#their-id').text(call.remoteID);
    });

    // call.close()による切断処理が実行され、実際に切断されたら発火
    call.on('close', function(){
        removeVideo(call.remoteID);
        setupMakeCallUI();
    });

}

//VIDEOを再生するための処理
function addVideo(call, stream){
    $('#their-video').get(0).srcObject = stream;
}

//video要素の削除
function removeVideo(peerID){
    $('#their-video').get(0).srcObject = undefined;
}

// ボタンの表示、非表示切り替え
function setupMakeCallUI(){
    $('#make-call').show();
    $('#end-call').hide();
}

function setupEndCallUI(){
    $('#make-call').hide();
    $('#end-call').show();
}


/* 以下、坂尻さんの実験 */
var myVideo = $('#my-video').get(0);
var ctracker = new clm.tracker();
var myCanvas = $('#myCanvas').get(0);
var animeCanvas = $('#animeCanvas').get(0);
var fd = new faceDeformer();

// Draw Video to Canvas
$(function(){
    ctrackerStart();
    setInterval(function(){
        drawLoop();
        getFacePositionData();
    },1000/30);
});

function ctrackerStart(){
    ctracker.init();
    ctracker.start(myCanvas);
    console.log('clmtrackking start...')
}


//var canvasInput = document.getElementById('drawCanvas');


function drawLoop() {
    let cc = myCanvas.getContext('2d');
    cc.clearRect(0, 0, myCanvas.width, myCanvas.height);
    cc.drawImage(myVideo, 0, 0, 480, 270);
    //ctracker.draw(myCanvas);
    

    // var img = new Image();
    // let cc = animeCanvas.getContext('2d');
    // img.src = "./img/mino3.png";
    // cc.clearRect(0, 0, animeCanvas.width, animeCanvas.height);
    // cc.drawImage(img, 0, 0, 250, 250);
    // ctracker.draw(animeCanvas);

}

function getFacePositionData() {
    let posData = ctracker.getCurrentPosition();
    fd.draw(posData);
    //console.log(posData);
}

function coveredWithMinosanMask() {
    //initial positons
    let masks = {
        "minosan" : [[108,284],[124,317],[139,354],[160,389],[189,419],[220,440],[262,462],[324,477],[382,458],[426,423],[445,398],[464,369],[482,337],[501,301],[517,246],[444,219],[407,186],[349,186],[324,224],[159,253],[182,216],[229,207],[271,235],[175,280],[206,246],[244,270],[212,290],[210,269],[431,246],[381,227],[356,259],[394,269],[389,250],[297, 249],[269,332],[258,346],[279,372],[310,364],[340,367],[354,338],[342,320],[301,288],[295,369],[324,367],[246,396],[265,389],[291,382],[312,383],[333,377],[359,377],[384,382],[378,405],[364,432],[322,453],[275,447],[256,426],[279,426],[316,438],[355,418],[342,414],[313,417],[284,419],[308,338],[182,257],[228,253],[232,281],[192,286],[408,237],[366,243],[375,269],[414,259]]
      };

    let fdcanvas = $('#animeCanvas').get(0);
    fd.init(fdcanvas);

    let maskImg = new Image();
    maskImg.src = "./img/mino3.png";
    fd.load(maskImg, masks["minosan"],pModel);
}


