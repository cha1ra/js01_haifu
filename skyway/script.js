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