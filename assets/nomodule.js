

const centrecolumn = document.getElementsByTagName("main")[0];

centrecolumn.appendChild(document.createElement("p")).innerText = "Please use a more up to date web browser to view these sites.";




const xreq = new XMLHttpRequest();
xreq.addEventListener("load", (event)=>{
    //const xreq = event.target;
    //console.log(xreq.status, xreq.responseType, xreq.response);
    const ProjectData = JSON.parse(xreq.response);
    //const result = [...new Set([...firstArr, ...secondArr])]
    const tagdict = {};
    ProjectData.ProjectList.forEach(project => {
        if(project.Omit){
            return;
        }
        project.Tags.forEach( tag=>{
            tagdict[tag] = true;
        });
    });
    let techs = "Technologies known: ";
    Object.keys(tagdict).forEach( (key,index) =>{
        techs+=(index>0?", ":"")+key;
    });
    centrecolumn.appendChild(document.createElement("p")).innerText = techs;
});
xreq.open("GET", "assets/projects/ProjectData.json");
xreq.send();



