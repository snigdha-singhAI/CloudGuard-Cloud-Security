let bucketPublic=true, score=62;
const permissions={Viewer:{Read:true,Write:false,Delete:false},Developer:{Read:true,Write:true,Delete:false},Admin:{Read:true,Write:true,Delete:true}};
function addLog(message,type="ok"){
  const log=document.getElementById("log"), time=new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});
  let dot=type==="bad"?"bad":type==="warn"?"warn":"ok";
  log.insertAdjacentHTML("beforeend",`<div><time>${time}</time><span class="dot ${dot}"></span><span>${message}</span><em>${type==="bad"?"DENIED":type==="warn"?"ALERT":"INFO"}</em></div>`);
}
function testAccess(){
  const role=document.getElementById("role").value,resource=document.getElementById("resource").value,action=document.getElementById("action").value,box=document.getElementById("accessResult");
  if(permissions[role][action]){
    box.className="result success";box.textContent=`✓ ALLOWED — ${role} can ${action.toLowerCase()} the ${resource}.`;
    addLog(`ALLOWED: ${role} → ${action} → ${resource}`);
    document.getElementById("iamStat").textContent="ENFORCED";
  }else{
    box.className="result failure";box.textContent=`✕ DENIED — Least privilege blocks ${role} from ${action.toLowerCase()} the ${resource}.`;
    addLog(`DENIED: ${role} → ${action} → ${resource}`,"bad");
  }
}
function toggleBucket(){
  bucketPublic=!bucketPublic;const btn=document.getElementById("bucketBtn"),status=document.getElementById("bucketStatus");
  if(bucketPublic){
    btn.textContent="PUBLIC";btn.className="bucketBtn";status.className="result danger";status.textContent="⚠ Public access may expose sensitive files.";
    document.getElementById("storageStat").textContent="PUBLIC";document.getElementById("riskStat").textContent="01";setScore(62);addLog("Storage bucket is PUBLIC","warn");
  }else{
    btn.textContent="PRIVATE";btn.className="bucketBtn secure";status.className="result success";status.textContent="✓ Protected — bucket access is private.";
    document.getElementById("storageStat").textContent="PRIVATE";document.getElementById("riskStat").textContent="00";setScore(82);addLog("Storage bucket changed to PRIVATE");
  }
}
function secureBucket(){
  if(bucketPublic)toggleBucket();
  document.getElementById("iamStat").textContent="ENFORCED";setScore(100);addLog("Secure governance policy applied");
}
function setScore(v){
  score=v;document.getElementById("score").textContent=v;document.getElementById("meter").style.width=v+"%";
  const state=document.getElementById("scoreState");state.textContent=v>=90?"Strong security posture":v>=75?"Improving security":"Needs attention";
}
