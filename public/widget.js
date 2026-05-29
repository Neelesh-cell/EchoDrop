"use strict";(()=>{var h=class{constructor(){this.color=this.getColorFromScript()||"#4f46e5",this.apiUrl="/api/feedback",this.projectId=this.getProjectIdFromScript()||"default",this.init()}getScriptTag(){return document.currentScript||document.querySelector('script[src*="widget.js"]')}getColorFromScript(){let s=this.getScriptTag();return s?s.getAttribute("data-color"):null}getProjectIdFromScript(){let s=this.getScriptTag();return s?s.getAttribute("data-project-id"):null}init(){this.container=document.createElement("div"),document.body.appendChild(this.container),this.shadow=this.container.attachShadow({mode:"open"}),this.render(),this.attachEvents()}render(){this.shadow.innerHTML=`
      <style>
        :host {
          --primary-color: ${this.color};
          font-family: system-ui, -apple-system, sans-serif;
        }
        .widget-button {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background-color: var(--primary-color);
          color: white;
          border: none;
          border-radius: 50%;
          width: 56px;
          height: 56px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99999;
          transition: transform 0.2s;
        }
        .widget-button:hover {
          transform: scale(1.05);
        }
        .widget-modal {
          position: fixed;
          bottom: 90px;
          right: 20px;
          width: 320px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
          z-index: 99999;
          display: none;
          flex-direction: column;
          overflow: hidden;
        }
        .widget-modal.open {
          display: flex;
        }
        .modal-header {
          background-color: var(--primary-color);
          color: white;
          padding: 16px;
          font-weight: 600;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .close-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 20px;
          line-height: 1;
        }
        .modal-body {
          padding: 16px;
        }
        .view-toggle {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }
        .view-btn {
          flex: 1;
          padding: 6px;
          border: 1px solid #ddd;
          background: #f9f9f9;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }
        .view-btn.active {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }
        .view-content {
          display: none;
        }
        .view-content.active {
          display: block;
        }
        textarea {
          width: 100%;
          height: 80px;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 6px;
          resize: none;
          margin-bottom: 12px;
          box-sizing: border-box;
        }
        .nps-scale {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .nps-btn {
          width: 24px;
          height: 24px;
          border: 1px solid #ddd;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
        }
        .nps-btn.selected {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }
        .submit-btn {
          width: 100%;
          padding: 10px;
          background-color: var(--primary-color);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
        }
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .message {
          text-align: center;
          padding: 20px 0;
          color: #333;
        }
        .error { color: #dc2626; margin-bottom: 10px; font-size: 12px; }
      </style>
      <button class="widget-button" id="toggle-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
      </button>
      
      <div class="widget-modal" id="modal">
        <div class="modal-header">
          <span>Leave Feedback</span>
          <button class="close-btn" id="close-btn">&times;</button>
        </div>
        <div class="modal-body" id="form-container">
          <div class="view-toggle">
            <button class="view-btn active" data-view="bug">Bug</button>
            <button class="view-btn" data-view="feature">Feature</button>
            <button class="view-btn" data-view="nps">NPS</button>
          </div>
          
          <div id="error-msg" class="error"></div>

          <div class="view-content active" id="view-bug">
            <textarea placeholder="Describe the bug..." id="bug-text"></textarea>
          </div>
          
          <div class="view-content" id="view-feature">
            <textarea placeholder="Describe your feature request..." id="feature-text"></textarea>
          </div>
          
          <div class="view-content" id="view-nps">
            <p style="margin-top:0; font-size: 14px;">How likely are you to recommend us?</p>
            <div class="nps-scale" id="nps-scale">
              ${Array.from({length:11},(s,a)=>`<button class="nps-btn" data-score="${a}">${a}</button>`).join("")}
            </div>
          </div>
          
          <button class="submit-btn" id="submit-btn">Submit</button>
        </div>
        
        <div class="modal-body message" id="success-message" style="display:none;">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto 16px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          <p>Thank you for your feedback!</p>
        </div>
      </div>
    `}attachEvents(){let s=this.shadow.getElementById("toggle-btn"),a=this.shadow.getElementById("close-btn"),l=this.shadow.getElementById("modal"),u=this.shadow.querySelectorAll(".view-btn"),m=this.shadow.querySelectorAll(".view-content"),c=this.shadow.querySelectorAll(".nps-btn"),r=this.shadow.getElementById("submit-btn"),e="bug",d=null;s.addEventListener("click",()=>l.classList.toggle("open")),a.addEventListener("click",()=>l.classList.remove("open")),u.forEach(i=>{i.addEventListener("click",t=>{u.forEach(o=>o.classList.remove("active")),m.forEach(o=>o.classList.remove("active")),t.target.classList.add("active"),e=t.target.dataset.view,this.shadow.getElementById(`view-${e}`).classList.add("active")})}),c.forEach(i=>{i.addEventListener("click",t=>{c.forEach(o=>o.classList.remove("selected")),t.target.classList.add("selected"),d=parseInt(t.target.dataset.score,10)})}),r.addEventListener("click",async()=>{let i=this.shadow.getElementById("error-msg");i.textContent="";let t="";if(e==="bug"&&(t=this.shadow.getElementById("bug-text").value),e==="feature"&&(t=this.shadow.getElementById("feature-text").value),e!=="nps"&&!t.trim()){i.textContent="Please enter a message.";return}if(e==="nps"&&d===null){i.textContent="Please select a score.";return}e==="nps"&&(t="NPS Rating"),r.disabled=!0,r.textContent="Submitting...";try{let o={project_id:this.projectId,type:e,message:t,nps_score:e==="nps"?d:null},p=this.getScriptTag(),g="";if(p&&p.src)try{g=new URL(p.src).origin}catch{}let b=await fetch(`${g}${this.apiUrl}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)});if(!b.ok){let n=await b.json().catch(()=>({}));throw new Error(n.error||"Failed to submit feedback")}this.shadow.getElementById("form-container").style.display="none",this.shadow.getElementById("success-message").style.display="block",setTimeout(()=>{l.classList.remove("open"),setTimeout(()=>{this.shadow.getElementById("form-container").style.display="block",this.shadow.getElementById("success-message").style.display="none",this.shadow.getElementById("bug-text").value="",this.shadow.getElementById("feature-text").value="",d=null,c.forEach(n=>n.classList.remove("selected")),r.disabled=!1,r.textContent="Submit"},300)},3e3)}catch(o){i.textContent=o.message,r.disabled=!1,r.textContent="Submit"}})}};typeof window<"u"&&new h;})();
