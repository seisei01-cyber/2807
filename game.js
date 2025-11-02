//playerの画像を読む込む変数
let img_player;
//canvasを使うための変数
let canvas,ctx;
//背景
let img_back;
let back_x,back_y;
//gameover画面
let img_over;
let over_x,over_y;
//playerのx,y座標用の変数
let player_x,player_y;
//playerのヒットポイント用変数
let p_hp;
//敵の画像を読み込む変数
let img_enemy;
//敵の数
let es=60;
//敵のx.y座標用の変数
let enemy_x=new Array(es);
let enemy_y=new Array(es);
//敵の移動速度
let e_speedx=new Array(es);
let e_speedy=new Array(es);
for(let i=0;i<es;i++){
    e_speedx[i]=2;
    e_speedy[i]=2;
}
//敵のヒットポイント用変数
let e_hp=new Array(es);
//敵の発生間隔用変数
let e_kankaku=30;
//敵発生までのカウント変数
let e_count=0;
//武器の画像を読み込む変数
let img_buki;
//武器のx,y座標用の変数
let buki_x,buki_y;
//武器のヒットポイント用変数
let b_hp;
//武器の回転角度用の変数
let deg=0;
//武器使用時間を制限するための変数
let b_time=400;
//武器使用許可用の変数
let b_use=0;
//得点表示用の変数
let score=0;

//キーが押されているかどうかを管理する配列（念のため256個）
let keys=new Array(256);
//全部のキーをfalse (押されてない)で定義
for(let i=0;i<keys.length;i++){
    keys[i]=false;
};
//キーが押された時の処理
window.onkeydown=function(e){
    //キーの状態をtrue(押された)に変更
    keys[e.keyCode]=true;
};
//キーが離された時の処理
window.onkeyup=function(e){
    //キーの状態をfalse（押されていない）に戻す
    keys[e.keyCode]=false;
};

//playerの移動処理
function move_p(){
    //playerのhpが０なら、playerの移動処理を抜ける
    if(p_hp<=0){
        return;
    }
    //移動速度
    let speed=20;
    //右矢印キーのコードを変数RIGHTに入れる
    let RIGHT=39;
    let LEFT=37;
    let UP=38;
    let DOWN=40;
    let SPACE=32;
    //右矢印キーが押されたら右にspeed分移動
    if(keys[RIGHT]){
        player_x=player_x+speed;
    }
    //左矢印キーが押されたら左にspeed分移動
    if(keys[LEFT]){
        player_x=player_x-speed;
    }
    //上矢印キーが押されたら上にspeed分移動
    if(keys[UP]){
        player_y=player_y-speed;
    }
    //下矢印キーが押されたら下にspeed分移動
    if(keys[DOWN]){
        player_y=player_y+speed;
    }
    //スペースキーが押されたら武器を表示
    //b_time（武器使用可能時間）が1以上なら武器の使用が可能（b_hpが１）
    if(keys[SPACE]){
        if(b_hp==0&&b_time>0&&b_use==0){
            b_hp=1;
        }
    }
    //スペースキーが離された時
    //b_hpが0になって、武器が非表示になる
    if(keys[SPACE]==false){
        b_hp=0;
    }
    //b_hpが1（スペースキーが押されている）の時
    //b_time（武器使用可能時間)を減らす
    if(b_hp==1){
        b_time=b_time-1;
    }
    //b_timeが0以下になったら武器使用不可にする
    if(b_time<=0){
        b_hp=0;
        b_use=1;
    }
    if(b_hp==0&&b_use==1){
        b_time=b_time+1;
    }
    if(b_time>400){
        b_time=400;
        b_use=0;
    }
    //キャンバスの左右からはみ出したらキャンバス内に戻す
    if(player_x<0){
        player_x=0;
    }
    if(player_x+img_player.width>canvas.width){
        player_x=canvas.width-img_player.width;
    }
    //キャンバスの上下からはみ出したらキャンバス内に戻す
    if(player_y<0){
        player_y=0;
    }
    if(player_y+img_player.height>canvas.height){
        player_y=canvas.height-img_player.height;
    }
};

//武器の動き
function move_b(){
    //角度の計算
    let radian=Math.PI/180*deg;
    //武器の座標（位置+回転の半径）
    buki_x=(player_x+img_player.width/2-img_buki.width/2)+80*Math.cos(radian);
    buki_y=(player_y+img_player.height/2-img_buki.height/2)+80*Math.sin(radian);
    deg=deg-300;

}

//敵の発生
function e_hassei(){
    for(let i=0;i<es;i++){
        //敵のhpが０なら敵を出現させる
        //敵を出現させたらbreakで処理を抜ける
        if(e_hp[i]==0&&e_count==0){
            enemy_x[i]=Math.random()*400;
            enemy_y[i]=0;
            e_hp[i]=1;
            e_count=e_kankaku;
            break;
        }
    }
    if(e_count>0){
        e_count=e_count-1;
    }
};

//敵の移動処理
function move_e(){
    for(let i=0;i<es;i++){
        //敵のhpが0なら、敵の移動処理を抜ける
        if(e_hp[i]<=0){
            continue;
        }
        //x,y方向にe_speedx,e_speedy分移動
        enemy_x[i]=enemy_x[i]+e_speedx[i];
        enemy_y[i]=enemy_y[i]+e_speedy[i];

        //上下左右の壁に当たると跳ね返る
        if(enemy_x[i]>canvas.width-img_enemy.width){
            enemy_x[i]=canvas.width-img_enemy.width;
            e_speedx[i]=e_speedx[i]*-1;
        }
        if(enemy_x[i]<0){
            enemy_x[i]=0;
            e_speedx[i]=e_speedx[i]*-1;
        }
        if(enemy_y[i]>canvas.height-img_enemy.height){
            enemy_y[i]=canvas.height-img_enemy.height;
            e_speedy[i]=e_speedy[i]*-1;
        }
        if(enemy_y[i]<0){
            enemy_y[i]=0;
            e_speedy[i]=e_speedy[i]*-1;
        }
    }
};

//キャンバスに描画
function redraw(){

    //キャンバスの画像を一旦クリア
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //背景
    ctx.drawImage(img_back,back_x,back_y);
    //生きているキャンバスにplayerの画像を再描画
    if(p_hp>0){
     ctx.drawImage(img_player,player_x,player_y);
    }
    //生きているキャンバスに敵の画像を描画
    for(let i=0;i<es;i++){
        if(e_hp[i]>0){
             ctx.drawImage(img_enemy,enemy_x[i],enemy_y[i]);
        }
    }
    //武器をキャンバスに描画
    if(b_hp>0){
        ctx.drawImage(img_buki,buki_x,buki_y);
    }

    //キャンバスの状態を保存
    ctx.save();
    //武器の使用時間をバーで表示する
    ctx.fillStyle="#fff";
    ctx.fillRect(canvas.width-110,canvas.height-20,100,10);
    ctx.fillStyle="#f00";
    ctx.fillRect(canvas.width-110,canvas.height-20,b_time/3,10);
    //得点を画面右上に表示する
    ctx.font="40px 'MSゴシック'";
    let s_width=ctx.measureText(score).width;
    ctx.fillStyle="#000";
    ctx.fillText(score,canvas.width-s_width-10,40);
    //「score」の文字を得点の横に表示する
    let s_text="SCORE"
    ctx.font="20px 'MSゴシック'";
    let s_text_width=ctx.measureText(s_text).width;
    ctx.fillStyle="#000";
    ctx.fillText(s_text,canvas.width-s_text_width-s_width-20,40);
    //「MP」の文字を赤いバーの横に表示する
    let m_text="MP";
    ctx.font="20px 'MSゴシック'";
    let m_text_width=ctx.measureText(m_text).width;
    ctx.fillStyle="#fff";
    ctx.fillText(m_text,canvas.width-150,canvas.height-10);
    //playerが敵にやられたときの処理
    if(p_hp<=0){
        // //画面全体を半透明の白い四角で覆う
        ctx.globalalpha=0.5;
        ctx.fillStyle="#000";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        // 画面中央に「GAME OVER」の文字を赤で表示する
        ctx.globalalpha=1.0;
        ctx.font="50px 'MSゴシック'";
        ctx.textBaseline="middle";
        ctx.fillStyle="#f00";
        let go_text="GAME OVER";
        let go_text_width=ctx.measureText(go_text).width;
        ctx.fillText(go_text,canvas.width/2-go_text_width/2,canvas.height/2);
        //背景
        
    }
    //キャンバスの状態を復元
    ctx.restore();
};

//タイトル画面の表示
function title(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //「enterキーで開始」と表示する
    ctx.save();
    ctx.font="40px 'MSゴシック'";
    ctx.textBaseline="middle";
    ctx.fillStyle="#fff";
    let t_text="ENTERキーで開始";
    let t_text_width=ctx.measureText(t_text).width;
    ctx.fillText(t_text,canvas.width/2-t_text_width/2,canvas.height/2);
    ctx.restore();
    //ENTERキーが押されたらゲームのメイン画面を呼び出す
    let ENTER=13;
    if(keys[ENTER]){
        mainloop();
        return;
    }
    window.requestAnimationFrame(title);
};

//メインループ
function mainloop(){
    //描画処理関数
    redraw();
    //playerの移動処理
    move_p();
    //敵の発生
    e_hassei();
    //敵の移動処理
    move_e();
    //武器の動き
    move_b();
    //playerと敵の当たり判定
    if(p_hp>0){
        for(let i=0;i<es;i++){
            if(e_hp[i]>0){
                if(hit_check(player_x,player_y,img_player,enemy_x[i],enemy_y[i],img_enemy)){
                    p_hp=p_hp-1;
                    e_hp[i]=e_hp[i]-1;
                    b_hp=b_hp-1;
                }
            }
        }
    }
    //敵同氏の当たり判定
    for(let i=0;i<es;i++){
        for(let j=i+1;j<es;j++){
            if(e_hp[i]>0 && e_hp[j]>0){
                if(hit_check(enemy_x[i],enemy_y[i],img_enemy,enemy_x[j],enemy_y[j],img_enemy)){
                    //当たっていれば跳ね返る
                    let rad=Math.atan2(enemy_y[i]-enemy_y[j],enemy_x[i]-enemy_x[j]);
                    e_speedx[i]=Math.cos(rad)*3;
                    e_speedy[i]=Math.sin(rad)*3;
                    e_speedx[j]=Math.cos(rad)*-3;
                    e_speedy[j]=Math.sin(rad)*-3;
                }

            }
        }
    }
    //敵と武器の当たり判定
    if(b_hp>0){
        for(let i=0;i<es;i++){
            if(e_hp[i]>0){
                if(hit_check(buki_x,buki_y,img_buki,enemy_x[i],enemy_y[i],img_enemy)){
                    e_hp[i]=e_hp[i]-1;
                    score=score+10;
                }
            }
        }
    }
    //メインループ内でメインループ関数を呼び込む
    window.requestAnimationFrame(mainloop);
};

//index.htmlを開いた時の処理
window.onload=function(){
    //キャンパスに画像を読み込む準備
    canvas=document.getElementById("screen");
    ctx=canvas.getContext("2d");

    //playerの画像を読み込む
    img_player=document.getElementById("player");
    //playerの初期位置
    player_x=30;
    player_y=430;
    p_hp=1;
    //敵の画像を起動時にキャンバスに読み込む
    img_enemy=document.getElementById("enemy");
    for(let i=0;i<es;i++){
        enemy_x[i]=0;
        enemy_y[i]=0;
        e_hp[i]=0;
    }
    //武器を画像を読み込む
    img_buki=document.getElementById("buki");
    buki_x=0;
    buki_y=0;
    b_hp=0;
    //背景
    img_back=document.getElementById("back");
    back_x=0;
    back_y=0;

    //playerの画像をキャンパスに描画
    mainloop();

    //title画面を呼び出す
    title();
};
function hit_check(x1,y1,obj1,x2,y2,obj2){
    let cx1,cy1,cx2,cy2,r1,r2,d;
    //当たり判定をする２つの物体の中心座標を計算
    cx1=x1+obj1.width/2;
    cy1=y1+obj1.height/2;
    cx2=x2+obj2.width/2;
    cy2=y2+obj2.height/2;
    //２つの物体の半径を計算
    r1=(obj1.width+obj1.height)/4;
    r2=(obj2.width+obj2.height)/4;
    //２つの物体の中心座標同士の距離を測る
    d=Math.sqrt(Math.pow(cx1-cx2,2)+Math.pow(cy1-cy2,2));
    //当たっているか判定する
    if(r1+r2>d){
        return true; //当たっている
    }else{
        return false; //当たっていない
    }
};
