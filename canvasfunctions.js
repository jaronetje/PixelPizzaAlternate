const{baseexp,addexp}=require('./level.json');
const{black}=require('./colors.json');
const{createCanvas,loadImage}=require('canvas');
function applyText(canvas,text,size){
    const ctx=canvas.getContext("2d");
    let fontSize=70;
    do{
        ctx.font=`${fontSize-=10}px sans-serif`;
    }while(ctx.measureText(text).width>canvas.width-size);
    return ctx.font;
}
export async function makeRankImg(user,level,exp,rank,style){
    const canvas=createCanvas(700,250);
    const ctx=canvas.getContext("2d");
    if(exp<0)exp=0;
    if(level<0)level=0;
    if(level>100)level=100;
    if(rank>=100)rank="99+";
    let neededExp=level==100?baseexp*level+addexp*(level-1):baseexp*(level+1)+addexp*level;
    let ranktext=`#${rank}`;
    ctx.fillStyle=style.back;
    ctx.fillRect(0,0,700,250);
    ctx.fillStyle=style.front;
    ctx.fillRect(15,20,670,210);
    ctx.font=applyText(canvas,user.username,480);
    ctx.fillStyle=black;
    ctx.fillText(user.username,canvas.width/3-10,canvas.height/1.6);
    ctx.font=applyText(canvas,level.toString(),500);
    let font=ctx.font.replace("px sans-serif","");
    let pos=canvas.width-(ctx.measureText(level.toString()).width + 20);
    ctx.fillText(level.toString(),pos,75);
    ctx.font="30px sans-serif";
    pos=pos-font-8;
    font=30;
    ctx.fillText("level",pos,75);
    ctx.font=applyText(canvas,ranktext,500);
    pos=pos-ctx.measureText(ranktext).width-5;
    font=ctx.font.replace("px sans-serif","");
    ctx.fillText(ranktext,pos,75);
    ctx.font="30px sans-serif";
    pos=pos-font-5;
    font=30;
    ctx.fillText("rank",pos,75);
    ctx.font=30;
    const expText=`${exp.toString()} / ${neededExp.toString()} xp`;
    ctx.fillText(expText,(canvas.width-(ctx.measureText(expText).width+20))-10,canvas.height/1.6);
    ctx.fillStyle=style.expBack;
    ctx.beginPath();
    ctx.arc(240,190,20,Math.PI*1.5,Math.PI*0.5,true);
    ctx.lineTo(650,210);
    ctx.arc(650,190,20,Math.PI*0.5,Math.PI*1.5,true);
    ctx.closePath();
    ctx.fill();
    if(exp!=0){
        const percent=exp/neededExp*100;
        let length=410/100*percent;
        ctx.fillStyle=style.expFront;
        ctx.beginPath();
        ctx.arc(240,190,20,Math.PI*1.5,Math.PI*0.5,true);
        ctx.lineTo(240+length,210);
        ctx.arc(240+length,190,20,Math.PI*0.5,Math.PI*1.5,true);
        ctx.closePath();
        ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(115,125,80,0,Math.PI*2,true);
    ctx.closePath();
    ctx.clip();
    const avatar=await loadImage(user.displayAvatarURL({format:"png"}));
    ctx.drawImage(avatar,35,45,160,160);
    return canvas;
}